<?php

namespace Drupal\dung_beetle_sightings_migration\Plugin\migrate\process;

use Drupal\migrate\MigrateException;
use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\Row;


/**
 * Perform custom value transformations.
 *
 * @MigrateProcessPlugin(
 *   id = "transform_value"
 * )
 *
 * To do custom value transformations use the following:
 *
 * @code
 * field_text:
 *   plugin: transform_value
 *   source: text
 * @endcode
 *
 */
class TransformValue extends ProcessPluginBase {
  /**
   * {@inheritdoc}
   */
  public function transform($value, MigrateExecutableInterface $migrate_executable, Row $row, $destination_property) {
    // Throw an error if value and reverse value are the same.
    if ($value === strrev($value)) {
      throw new MigrateException('Reverse value is the same as value.');
    }
    $xval = $value/1000;
    return date('Y-m-d',$xval);
  }
}