<?php

namespace Drupal\dung_beetle_sightings\Controller;

use Drupal\Component\Utility\Xss;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Datetime\DateFormatter;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Render\Renderer;
use Drupal\Core\Url;
use Drupal\dung_beetle_sightings\Entity\SightingsInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class SightingsController.
 *
 *  Returns responses for Sightings routes.
 */
class SightingsController extends ControllerBase implements ContainerInjectionInterface {


  /**
   * The date formatter.
   *
   * @var \Drupal\Core\Datetime\DateFormatter
   */
  protected $dateFormatter;

  /**
   * The renderer.
   *
   * @var \Drupal\Core\Render\Renderer
   */
  protected $renderer;

  /**
   * Constructs a new SightingsController.
   *
   * @param \Drupal\Core\Datetime\DateFormatter $date_formatter
   *   The date formatter.
   * @param \Drupal\Core\Render\Renderer $renderer
   *   The renderer.
   */
  public function __construct(DateFormatter $date_formatter, Renderer $renderer) {
    $this->dateFormatter = $date_formatter;
    $this->renderer = $renderer;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('date.formatter'),
      $container->get('renderer')
    );
  }

  /**
   * Displays a Sightings revision.
   *
   * @param int $sightings_revision
   *   The Sightings revision ID.
   *
   * @return array
   *   An array suitable for drupal_render().
   */
  public function revisionShow($sightings_revision) {
    $sightings = $this->entityTypeManager()->getStorage('sightings')
      ->loadRevision($sightings_revision);
    $view_builder = $this->entityTypeManager()->getViewBuilder('sightings');

    return $view_builder->view($sightings);
  }

  /**
   * Page title callback for a Sightings revision.
   *
   * @param int $sightings_revision
   *   The Sightings revision ID.
   *
   * @return string
   *   The page title.
   */
  public function revisionPageTitle($sightings_revision) {
    $sightings = $this->entityTypeManager()->getStorage('sightings')
      ->loadRevision($sightings_revision);
    return $this->t('Revision of %title from %date', [
      '%title' => $sightings->label(),
      '%date' => $this->dateFormatter->format($sightings->getRevisionCreationTime()),
    ]);
  }

  /**
   * Generates an overview table of older revisions of a Sightings.
   *
   * @param \Drupal\dung_beetle_sightings\Entity\SightingsInterface $sightings
   *   A Sightings object.
   *
   * @return array
   *   An array as expected by drupal_render().
   */
  public function revisionOverview(SightingsInterface $sightings) {
    $account = $this->currentUser();
    $sightings_storage = $this->entityTypeManager()->getStorage('sightings');

    $langcode = $sightings->language()->getId();
    $langname = $sightings->language()->getName();
    $languages = $sightings->getTranslationLanguages();
    $has_translations = (count($languages) > 1);
    $build['#title'] = $has_translations ? $this->t('@langname revisions for %title', ['@langname' => $langname, '%title' => $sightings->label()]) : $this->t('Revisions for %title', ['%title' => $sightings->label()]);

    $header = [$this->t('Revision'), $this->t('Operations')];
    $revert_permission = (($account->hasPermission("revert all sightings revisions") || $account->hasPermission('administer sightings entities')));
    $delete_permission = (($account->hasPermission("delete all sightings revisions") || $account->hasPermission('administer sightings entities')));

    $rows = [];

    $vids = $sightings_storage->revisionIds($sightings);

    $latest_revision = TRUE;

    foreach (array_reverse($vids) as $vid) {
      /** @var \Drupal\dung_beetle_sightings\SightingsInterface $revision */
      $revision = $sightings_storage->loadRevision($vid);
      // Only show revisions that are affected by the language that is being
      // displayed.
      if ($revision->hasTranslation($langcode) && $revision->getTranslation($langcode)->isRevisionTranslationAffected()) {
        $username = [
          '#theme' => 'username',
          '#account' => $revision->getRevisionUser(),
        ];

        // Use revision link to link to revisions that are not active.
        $date = $this->dateFormatter->format($revision->getRevisionCreationTime(), 'short');
        if ($vid != $sightings->getRevisionId()) {
          $link = $this->l($date, new Url('entity.sightings.revision', [
            'sightings' => $sightings->id(),
            'sightings_revision' => $vid,
          ]));
        }
        else {
          $link = $sightings->link($date);
        }

        $row = [];
        $column = [
          'data' => [
            '#type' => 'inline_template',
            '#template' => '{% trans %}{{ date }} by {{ username }}{% endtrans %}{% if message %}<p class="revision-log">{{ message }}</p>{% endif %}',
            '#context' => [
              'date' => $link,
              'username' => $this->renderer->renderPlain($username),
              'message' => [
                '#markup' => $revision->getRevisionLogMessage(),
                '#allowed_tags' => Xss::getHtmlTagList(),
              ],
            ],
          ],
        ];
        $row[] = $column;

        if ($latest_revision) {
          $row[] = [
            'data' => [
              '#prefix' => '<em>',
              '#markup' => $this->t('Current revision'),
              '#suffix' => '</em>',
            ],
          ];
          foreach ($row as &$current) {
            $current['class'] = ['revision-current'];
          }
          $latest_revision = FALSE;
        }
        else {
          $links = [];
          if ($revert_permission) {
            $links['revert'] = [
              'title' => $this->t('Revert'),
              'url' => $has_translations ?
              Url::fromRoute('entity.sightings.translation_revert', [
                'sightings' => $sightings->id(),
                'sightings_revision' => $vid,
                'langcode' => $langcode,
              ]) :
              Url::fromRoute('entity.sightings.revision_revert', [
                'sightings' => $sightings->id(),
                'sightings_revision' => $vid,
              ]),
            ];
          }

          if ($delete_permission) {
            $links['delete'] = [
              'title' => $this->t('Delete'),
              'url' => Url::fromRoute('entity.sightings.revision_delete', [
                'sightings' => $sightings->id(),
                'sightings_revision' => $vid,
              ]),
            ];
          }

          $row[] = [
            'data' => [
              '#type' => 'operations',
              '#links' => $links,
            ],
          ];
        }

        $rows[] = $row;
      }
    }

    $build['sightings_revisions_table'] = [
      '#theme' => 'table',
      '#rows' => $rows,
      '#header' => $header,
    ];

    return $build;
  }

}
