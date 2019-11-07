<?php

namespace Drupal\dung_beetle_sightings;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityListBuilder;
use Drupal\Core\Link;

/**
 * Defines a class to build a listing of Sightings entities.
 *
 * @ingroup dung_beetle_sightings
 */
class SightingsListBuilder extends EntityListBuilder {

  /**
   * {@inheritdoc}
   */
  public function buildHeader() {
    $header['id'] = $this->t('Sightings ID');
    $header['name'] = $this->t('Name');
    return $header + parent::buildHeader();
  }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity) {
    /* @var \Drupal\dung_beetle_sightings\Entity\Sightings $entity */
    $row['id'] = $entity->id();
    $row['name'] = Link::createFromRoute(
      $entity->label(),
      'entity.sightings.edit_form',
      ['sightings' => $entity->id()]
    );
    return $row + parent::buildRow($entity);
  }

}
