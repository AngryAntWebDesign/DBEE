<?php

namespace Drupal\dung_beetle_sightings;

use Drupal\Core\Entity\ContentEntityStorageInterface;
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
interface SightingsStorageInterface extends ContentEntityStorageInterface {

  /**
   * Gets a list of Sightings revision IDs for a specific Sightings.
   *
   * @param \Drupal\dung_beetle_sightings\Entity\SightingsInterface $entity
   *   The Sightings entity.
   *
   * @return int[]
   *   Sightings revision IDs (in ascending order).
   */
  public function revisionIds(SightingsInterface $entity);

  /**
   * Gets a list of revision IDs having a given user as Sightings author.
   *
   * @param \Drupal\Core\Session\AccountInterface $account
   *   The user entity.
   *
   * @return int[]
   *   Sightings revision IDs (in ascending order).
   */
  public function userRevisionIds(AccountInterface $account);

  /**
   * Counts the number of revisions in the default language.
   *
   * @param \Drupal\dung_beetle_sightings\Entity\SightingsInterface $entity
   *   The Sightings entity.
   *
   * @return int
   *   The number of revisions in the default language.
   */
  public function countDefaultLanguageRevisions(SightingsInterface $entity);

  /**
   * Unsets the language for all Sightings with the given language.
   *
   * @param \Drupal\Core\Language\LanguageInterface $language
   *   The language object.
   */
  public function clearRevisionsLanguage(LanguageInterface $language);

}
