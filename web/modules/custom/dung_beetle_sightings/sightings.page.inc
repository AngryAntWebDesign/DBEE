<?php

/**
 * @file
 * Contains sightings.page.inc.
 *
 * Page callback for Sightings entities.
 */

use Drupal\Core\Render\Element;

/**
 * Prepares variables for Sightings templates.
 *
 * Default template: sightings.html.twig.
 *
 * @param array $variables
 *   An associative array containing:
 *   - elements: An associative array containing the user information and any
 *   - attributes: HTML attributes for the containing element.
 */
function template_preprocess_sightings(array &$variables) {
  // Fetch Sightings Entity Object.
  $sightings = $variables['elements']['#sightings'];

  // Helpful $content variable for templates.
  foreach (Element::children($variables['elements']) as $key) {
    $variables['content'][$key] = $variables['elements'][$key];
  }
}
