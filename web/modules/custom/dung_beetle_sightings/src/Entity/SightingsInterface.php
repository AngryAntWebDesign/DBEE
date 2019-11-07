<?php

namespace Drupal\dung_beetle_sightings\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\RevisionLogInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\Core\Entity\EntityPublishedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface for defining Sightings entities.
 *
 * @ingroup dung_beetle_sightings
 */
interface SightingsInterface extends ContentEntityInterface, RevisionLogInterface, EntityChangedInterface, EntityPublishedInterface, EntityOwnerInterface {

  /**
   * Add get/set methods for your configuration properties here.
   */

  /**
   * Gets the Sightings name.
   *
   * @return string
   *   Name of the Sightings.
   */
  public function getName();

  /**
   * Sets the Sightings name.
   *
   * @param string $name
   *   The Sightings name.
   *
   * @return \Drupal\dung_beetle_sightings\Entity\SightingsInterface
   *   The called Sightings entity.
   */
  public function setName($name);

  /**
   * Gets the Sightings creation timestamp.
   *
   * @return int
   *   Creation timestamp of the Sightings.
   */
  public function getCreatedTime();

  /**
   * Sets the Sightings creation timestamp.
   *
   * @param int $timestamp
   *   The Sightings creation timestamp.
   *
   * @return \Drupal\dung_beetle_sightings\Entity\SightingsInterface
   *   The called Sightings entity.
   */
  public function setCreatedTime($timestamp);

  /**
   * Gets the Sightings revision creation timestamp.
   *
   * @return int
   *   The UNIX timestamp of when this revision was created.
   */
  public function getRevisionCreationTime();

  /**
   * Sets the Sightings revision creation timestamp.
   *
   * @param int $timestamp
   *   The UNIX timestamp of when this revision was created.
   *
   * @return \Drupal\dung_beetle_sightings\Entity\SightingsInterface
   *   The called Sightings entity.
   */
  public function setRevisionCreationTime($timestamp);

  /**
   * Gets the Sightings revision author.
   *
   * @return \Drupal\user\UserInterface
   *   The user entity for the revision author.
   */
  public function getRevisionUser();

  /**
   * Sets the Sightings revision author.
   *
   * @param int $uid
   *   The user ID of the revision author.
   *
   * @return \Drupal\dung_beetle_sightings\Entity\SightingsInterface
   *   The called Sightings entity.
   */
  public function setRevisionUserId($uid);

}
