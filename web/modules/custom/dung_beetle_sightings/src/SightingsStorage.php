<?php

namespace Drupal\dung_beetle_sightings;

use Drupal\Core\Entity\Sql\SqlContentEntityStorage;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Language\LanguageInterface;
use Drupal\dung_beetle_sightings\Entity\SightingsInterface;

/**
 * Defines the storage handler class for Sightings entities.
 *
 * This extends the base storage class, adding required special handling for
 * Sightings entities.
 *
 * @ingroup dung_beetle_sightings
 */
class SightingsStorage extends SqlContentEntityStorage implements SightingsStorageInterface {

  /**
   * {@inheritdoc}
   */
  public function revisionIds(SightingsInterface $entity) {
    return $this->database->query(
      'SELECT vid FROM {sightings_revision} WHERE id=:id ORDER BY vid',
      [':id' => $entity->id()]
    )->fetchCol();
  }

  /**
   * {@inheritdoc}
   */
  public function userRevisionIds(AccountInterface $account) {
    return $this->database->query(
      'SELECT vid FROM {sightings_field_revision} WHERE uid = :uid ORDER BY vid',
      [':uid' => $account->id()]
    )->fetchCol();
  }

  /**
   * {@inheritdoc}
   */
  public function countDefaultLanguageRevisions(SightingsInterface $entity) {
    return $this->database->query('SELECT COUNT(*) FROM {sightings_field_revision} WHERE id = :id AND default_langcode = 1', [':id' => $entity->id()])
      ->fetchField();
  }

  /**
   * {@inheritdoc}
   */
  public function clearRevisionsLanguage(LanguageInterface $language) {
    return $this->database->update('sightings_revision')
      ->fields(['langcode' => LanguageInterface::LANGCODE_NOT_SPECIFIED])
      ->condition('langcode', $language->getId())
      ->execute();
  }

}
