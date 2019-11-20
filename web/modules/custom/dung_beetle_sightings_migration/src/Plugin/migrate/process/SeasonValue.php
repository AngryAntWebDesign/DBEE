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
 *   id = "season_value"
 * )
 *
 * To do custom value transformations use the following:
 *
 * @code
 * field_text:
 *   plugin: season_value
 *   source: text
 * @endcode
 *
 */
class SeasonValue extends ProcessPluginBase {
  /**
   * {@inheritdoc}
   */
    public function transform($value, MigrateExecutableInterface $migrate_executable, Row $row, $destination_property) 
    {
        // Throw an error if value and reverse value are the same.
        if ($value === strrev($value)) {
            throw new MigrateException('Reverse value is the same as value.');
        }
        if ($value >= '1' and $value <= '2') {
            $xval = 'Summer';
        } elseif ($value >= '3' and $value <= '5') {
            $xval = 'Autumn';
        } elseif ($value >= '6' and $value <= '8') {
            $xval = 'Winter';
        } elseif ($value >= '9' and $value <= '11') {
            $xval = 'Spring';
        } elseif ($value == '12') {
            $xval = 'Summer';
        } else {
            $xval = 'Summer';
        }    
        return $xval;
    }
}