<?php

namespace Drupal\dung_beetle_sightings\Entity;

use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\EditorialContentEntityBase;
use Drupal\Core\Entity\RevisionableInterface;
use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityPublishedTrait;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\user\UserInterface;

/**
 * Defines the Sightings entity.
 *
 * @ingroup dung_beetle_sightings
 *
 * @ContentEntityType(
 *   id = "sightings",
 *   label = @Translation("Sightings"),
 *   handlers = {
 *     "storage" = "Drupal\dung_beetle_sightings\SightingsStorage",
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
 *     "list_builder" = "Drupal\dung_beetle_sightings\SightingsListBuilder",
 *     "views_data" = "Drupal\dung_beetle_sightings\Entity\SightingsViewsData",
 *     "translation" = "Drupal\dung_beetle_sightings\SightingsTranslationHandler",
 *
 *     "form" = {
 *       "default" = "Drupal\dung_beetle_sightings\Form\SightingsForm",
 *       "add" = "Drupal\dung_beetle_sightings\Form\SightingsForm",
 *       "edit" = "Drupal\dung_beetle_sightings\Form\SightingsForm",
 *       "delete" = "Drupal\dung_beetle_sightings\Form\SightingsDeleteForm",
 *     },
 *     "route_provider" = {
 *       "html" = "Drupal\dung_beetle_sightings\SightingsHtmlRouteProvider",
 *     },
 *     "access" = "Drupal\dung_beetle_sightings\SightingsAccessControlHandler",
 *   },
 *   base_table = "sightings",
 *   data_table = "sightings_field_data",
 *   revision_table = "sightings_revision",
 *   revision_data_table = "sightings_field_revision",
 *   translatable = TRUE,
 *   permission_granularity = "bundle",
 *   admin_permission = "administer sightings entities",
 *   entity_keys = {
 *     "id" = "id",
 *     "revision" = "vid",
 *     "label" = "name",
 *     "uuid" = "uuid",
 *     "uid" = "user_id",
 *     "langcode" = "langcode",
 *     "published" = "status",
 *   },
 *   links = {
 *     "canonical" = "/admin/structure/sightings/{sightings}",
 *     "add-form" = "/admin/structure/sightings/add",
 *     "edit-form" = "/admin/structure/sightings/{sightings}/edit",
 *     "delete-form" = "/admin/structure/sightings/{sightings}/delete",
 *     "version-history" = "/admin/structure/sightings/{sightings}/revisions",
 *     "revision" = "/admin/structure/sightings/{sightings}/revisions/{sightings_revision}/view",
 *     "revision_revert" = "/admin/structure/sightings/{sightings}/revisions/{sightings_revision}/revert",
 *     "revision_delete" = "/admin/structure/sightings/{sightings}/revisions/{sightings_revision}/delete",
 *     "translation_revert" = "/admin/structure/sightings/{sightings}/revisions/{sightings_revision}/revert/{langcode}",
 *     "collection" = "/admin/structure/sightings",
 *   },
 *   field_ui_base_route = "sightings.settings"
 * )
 */
class Sightings extends EditorialContentEntityBase implements SightingsInterface {

  use EntityChangedTrait;
  use EntityPublishedTrait;

  /**
   * {@inheritdoc}
   */
  public static function preCreate(EntityStorageInterface $storage_controller, array &$values) {
    parent::preCreate($storage_controller, $values);
    $values += [
      'user_id' => \Drupal::currentUser()->id(),
    ];
  }

  /**
   * {@inheritdoc}
   */
  protected function urlRouteParameters($rel) {
    $uri_route_parameters = parent::urlRouteParameters($rel);

    if ($rel === 'revision_revert' && $this instanceof RevisionableInterface) {
      $uri_route_parameters[$this->getEntityTypeId() . '_revision'] = $this->getRevisionId();
    }
    elseif ($rel === 'revision_delete' && $this instanceof RevisionableInterface) {
      $uri_route_parameters[$this->getEntityTypeId() . '_revision'] = $this->getRevisionId();
    }

    return $uri_route_parameters;
  }

  /**
   * {@inheritdoc}
   */
  public function preSave(EntityStorageInterface $storage) {
    parent::preSave($storage);

    foreach (array_keys($this->getTranslationLanguages()) as $langcode) {
      $translation = $this->getTranslation($langcode);

      // If no owner has been set explicitly, make the anonymous user the owner.
      if (!$translation->getOwner()) {
        $translation->setOwnerId(0);
      }
    }

    // If no revision author has been set explicitly,
    // make the sightings owner the revision author.
    if (!$this->getRevisionUser()) {
      $this->setRevisionUserId($this->getOwnerId());
    }
  }

  /**
   * {@inheritdoc}
   */
  public function getName() {
    return $this->get('name')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setName($name) {
    $this->set('name', $name);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getCreatedTime() {
    return $this->get('created')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setCreatedTime($timestamp) {
    $this->set('created', $timestamp);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getOwner() {
    return $this->get('user_id')->entity;
  }

  /**
   * {@inheritdoc}
   */
  public function getOwnerId() {
    return $this->get('user_id')->target_id;
  }

  /**
   * {@inheritdoc}
   */
  public function setOwnerId($uid) {
    $this->set('user_id', $uid);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function setOwner(UserInterface $account) {
    $this->set('user_id', $account->id());
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    $fields = parent::baseFieldDefinitions($entity_type);

    // Add the published field.
    $fields += static::publishedBaseFieldDefinitions($entity_type);

    $fields['user_id'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('Authored by'))
      ->setDescription(t('The user ID of author of the Sightings entity.'))
      ->setRevisionable(TRUE)
      ->setSetting('target_type', 'user')
      ->setSetting('handler', 'default')
      ->setTranslatable(TRUE)
      ->setDisplayOptions('view', [
        'label' => 'hidden',
        'type' => 'author',
        'weight' => 0,
      ])
      ->setDisplayOptions('form', [
        'type' => 'entity_reference_autocomplete',
        'weight' => 5,
        'settings' => [
          'match_operator' => 'CONTAINS',
          'size' => '60',
          'autocomplete_type' => 'tags',
          'placeholder' => '',
        ],
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);

    $fields['name'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Name'))
      ->setDescription(t('The name of the Sightings entity.'))
      ->setRevisionable(TRUE)
      ->setSettings([
        'max_length' => 50,
        'text_processing' => 0,
      ])
      ->setDefaultValue('')
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'string',
        'weight' => -10,
      ])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -10,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE)
      ->setRequired(TRUE);



      // species name
      // $fields['species'] = BaseFieldDefinition::create('string')
      // ->setLabel(t('Species'))
      // ->setDescription(t('The Species of the Sighting entity.'))
      // ->setRevisionable(TRUE)
      // ->setSettings([
      //   'max_length' => 50,
      //   'text_processing' => 0,
      // ])
      // ->setDefaultValue('')
      // ->setDisplayOptions('view', [
      //   'label' => 'above',
      //   'type' => 'string',
      //   'weight' => -10,
      // ])
      // ->setDisplayOptions('form', [
      //   'type' => 'string_textfield',
      //   'weight' => -10,
      // ])
      // ->setDisplayConfigurable('form', TRUE)
      // ->setDisplayConfigurable('view', TRUE)
      // ->setRequired(TRUE);

      $fields['species'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('Species'))
      ->setDescription(t('The name of the species.'))
      ->setSetting('target_type', 'taxonomy_term')
      ->setSetting('handler', 'default:taxonomy_term')
      ->setSetting('handler_settings', 
          array(
        'target_bundles' => array(
         'species' => 'species'
        )))
      ->setDisplayOptions('view', array(
        'label' => 'hidden',
        'type' => 'author',
        'weight' => 0,
      ))
      ->setDisplayOptions('form', array(
        'type' => 'entity_reference_autocomplete',
        'weight' => 3,
        'settings' => array(
          'match_operator' => 'CONTAINS',
          'size' => '30',
          'autocomplete_type' => 'tags',
          'placeholder' => '',
        ),
      ))
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);
      // end species 


      // Sighting Date
      $fields['sighting_date'] = BaseFieldDefinition::create('datetime')
      ->setLabel(t('Sighting Date'))
      ->setDescription(t('The date of the Sighting.'))
      ->setRevisionable(TRUE)
      ->setSettings([
        'datetime_type' => 'date'
        ])
      ->setDefaultValue('')
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'datetime_default',
        'weight' => -4,
      ])
      ->setDisplayOptions('form', [
        'type' => 'datetime_default',
        'weight' => -4,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE)
      ->setRequired(TRUE);

   // Sighting Date
   $fields['sighting_date2'] = BaseFieldDefinition::create('created')
   ->setLabel(t('Sighting Date 2'))
   ->setDescription(t('The date of the Sighting in a creatd date field.'))
   ->setRevisionable(TRUE)
   ->setDisplayOptions('view', [
     'label' => 'above',
     'type' => 'timestamp',
     'weight' => -4,
   ])
   ->setDisplayOptions('form', [
     'type' => 'datetime_timestamp',
     'weight' => -4,
   ])
   ->setDisplayConfigurable('form', TRUE)
   ->setDisplayConfigurable('view', TRUE)
   ->setRequired(TRUE);


      // Occurance Year
      $fields['occurance_year'] = BaseFieldDefinition::create('integer')
      ->setLabel(t('Occurance Year'))
      ->setDescription(t('The Occurance year of the Sighting entity.'))
      ->setRevisionable(TRUE)
      ->setSettings([
        'max_length' => 50,
        'text_processing' => 0,
      ])
      ->setDefaultValue('')
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'string',
        'weight' => -4,
      ])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -4,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE)
      ->setRequired(TRUE);

      // taxomRankID
      $fields['taxonRankID'] = BaseFieldDefinition::create('integer')
      ->setLabel(t('taxonRankID'))
      ->setDescription(t('The taxonRankID of the Sighting entity.'))
      ->setRevisionable(TRUE)
      ->setSettings([
        'max_length' => 50,
        'text_processing' => 0,
      ])
      ->setDefaultValue('')
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'integer',
        'weight' => -4,
      ])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -4,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE)
      ->setRequired(TRUE);

       // Kingdom
      $fields['kingdom'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Kingdom'))
      ->setDescription(t('The Kingdom of the Sighting entity.'))
      ->setRevisionable(TRUE)
      ->setSettings([
        'max_length' => 50,
        'text_processing' => 0,
      ])
      ->setDefaultValue('')
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'string',
        'weight' => -4,
      ])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -4,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE)
      ->setRequired(TRUE);

      // Phylum
      $fields['phylum'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Phylum'))
      ->setDescription(t('The Phylum of the Sighting entity.'))
      ->setRevisionable(TRUE)
      ->setSettings([
        'max_length' => 50,
        'text_processing' => 0,
      ])
      ->setDefaultValue('')
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'string',
        'weight' => -4,
      ])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -4,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE)
      ->setRequired(TRUE);

      // Class
      $fields['class'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Class'))
      ->setDescription(t('The Class of the Sighting entity.'))
      ->setRevisionable(TRUE)
      ->setSettings([
        'max_length' => 50,
        'text_processing' => 0,
      ])
      ->setDefaultValue('')
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'string',
        'weight' => -4,
      ])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -4,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE)
      ->setRequired(TRUE);

      // Family
      $fields['family'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Family'))
      ->setDescription(t('The family of the species.'))
      ->setRevisionable(TRUE)
      ->setSettings([
        'max_length' => 50,
        'text_processing' => 0,
      ])
      ->setDefaultValue('')
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'string',
        'weight' => -4,
      ])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -4,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE)
      ->setRequired(TRUE);

      // Genus
      // $fields['genus'] = BaseFieldDefinition::create('string')
      // ->setLabel(t('Genus'))
      // ->setDescription(t('The Genus of the species.'))
      // ->setRevisionable(TRUE)
      // ->setSettings([
      //   'max_length' => 50,
      //   'text_processing' => 0,
      // ])
      // ->setDefaultValue('')
      // ->setDisplayOptions('view', [
      //   'label' => 'above',
      //   'type' => 'string',
      //   'weight' => -4,
      // ])
      // ->setDisplayOptions('form', [
      //   'type' => 'string_textfield',
      //   'weight' => -4,
      // ])
      // ->setDisplayConfigurable('form', TRUE)
      // ->setDisplayConfigurable('view', TRUE)
      // ->setRequired(TRUE);

      $fields['genus'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('Genus'))
      ->setDescription(t('The genus of the species.'))      
      ->setSetting('target_type', 'taxonomy_term')
      ->setSetting('handler', 'default:taxonomy_term')
      ->setSetting('handler_settings', 
          array(
        'target_bundles' => array(
         'genus' => 'genus'
        )))
      ->setDisplayOptions('view', array(
        'label' => 'hidden',
        'type' => 'author',
        'weight' => 0,
      ))
      ->setDisplayOptions('form', array(
        'type' => 'entity_reference_autocomplete',
        'weight' => 3,
        'settings' => array(
          'match_operator' => 'CONTAINS',
          'size' => '30',
          'autocomplete_type' => 'tags',
          'placeholder' => '',
        ),
      ))
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);


      // State
      $fields['state'] = BaseFieldDefinition::create('string')
      ->setLabel(t('State'))
      ->setDescription(t('The State of the species sighting.'))
      ->setRevisionable(TRUE)
      ->setSettings([
        'max_length' => 50,
        'text_processing' => 0,
      ])
      ->setDefaultValue('')
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'string',
        'weight' => -4,
      ])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -4,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE)
      ->setRequired(TRUE);
    
      // decimalLatitude
      $fields['decimalLatitude'] = BaseFieldDefinition::create('decimal')
      ->setLabel(t('Decimal Latitude'))
      ->setDescription(t('The Decimal Latitude of the species sighting.'))
      ->setRevisionable(TRUE)
      ->setSettings([
        'max_length' => 50,
        'text_processing' => 0,
      ])
      ->setDefaultValue('')
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'string',
        'weight' => -4,
      ])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -4,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE)
      ->setRequired(TRUE);

      // decimalLongitude
      $fields['decimalLongitude'] = BaseFieldDefinition::create('decimal')
      ->setLabel(t('Decimal Longitude'))
      ->setDescription(t('The Decimal Longitude of the species sighting.'))
      ->setRevisionable(TRUE)
      ->setSettings([
        'max_length' => 50,
        'text_processing' => 0,
      ])
      ->setDefaultValue('')
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'string',
        'weight' => -4,
      ])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -4,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE)
      ->setRequired(TRUE);

      // Year
      $fields['year'] = BaseFieldDefinition::create('integer')
      ->setLabel(t('Year'))
      ->setDescription(t('The Year of the species sighting.'))
      ->setRevisionable(TRUE)
      ->setSettings([
        'max_length' => 50,
        'text_processing' => 0,
      ])
      ->setDefaultValue('')
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'string',
        'weight' => -4,
      ])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -4,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE)
      ->setRequired(TRUE);

      // Month
      $fields['month'] = BaseFieldDefinition::create('integer')
      ->setLabel(t('Month'))
      ->setDescription(t('The Month of the species sighting.'))
      ->setRevisionable(TRUE)
      ->setSettings([
        'max_length' => 50,
        'text_processing' => 0,
      ])
      ->setDefaultValue('')
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'string',
        'weight' => -4,
      ])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -4,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE)
      ->setRequired(TRUE);

      // LGA
      $fields['lga'] = BaseFieldDefinition::create('string')
      ->setLabel(t('lga'))
      ->setDescription(t('The Local Governing Area (LGA) of the species sighting.'))
      ->setRevisionable(TRUE)
      ->setSettings([
        'max_length' => 50,
        'text_processing' => 0,
      ])
      ->setDefaultValue('')
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'string',
        'weight' => -4,
      ])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -4,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE)
      ->setRequired(TRUE);


      // vernacularName
      $fields['vernacular_name'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Vernacular Name'))
      ->setDescription(t('Vernacular Name of the species sighting.'))
      ->setRevisionable(TRUE)
      ->setSettings([
        'max_length' => 50,
        'text_processing' => 0,
      ])
      ->setDefaultValue('')
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'string',
        'weight' => -9,
      ])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -9,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE)
      ->setRequired(TRUE);

      // order
      $fields['order'] = BaseFieldDefinition::create('string')
      ->setLabel(t('order'))
      ->setDescription(t('Order of the species sighting.'))
      ->setRevisionable(TRUE)
      ->setSettings([
        'max_length' => 50,
        'text_processing' => 0,
      ])
      ->setDefaultValue('')
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'string',
        'weight' => -5,
      ])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -5,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE)
      ->setRequired(TRUE);


      // order
      $fields['latLong'] = BaseFieldDefinition::create('geofield')
      ->setLabel(t('latLong'))
      ->setDescription(t('latlong of the species sighting.'))
      ->setRevisionable(TRUE)
      ->setSettings([
        'max_length' => 50,
        'text_processing' => 0,
      ])
      ->setDefaultValue('')
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'geofield',
        'weight' => -5,
      ])
      ->setDisplayOptions('form', [
        'type' => 'geofield',
        'weight' => -5,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE)
      ->setRequired(TRUE);




    $fields['status']->setDescription(t('A boolean indicating whether the Sightings is published.'))
      ->setDisplayOptions('form', [
        'type' => 'boolean_checkbox',
        'weight' => -3,
      ]);

    $fields['created'] = BaseFieldDefinition::create('created')
      ->setLabel(t('Created'))
      ->setDescription(t('The time that the entity was created.'));

    $fields['changed'] = BaseFieldDefinition::create('changed')
      ->setLabel(t('Changed'))
      ->setDescription(t('The time that the entity was last edited.'));

    $fields['revision_translation_affected'] = BaseFieldDefinition::create('boolean')
      ->setLabel(t('Revision translation affected'))
      ->setDescription(t('Indicates if the last edit of a translation belongs to current revision.'))
      ->setReadOnly(TRUE)
      ->setRevisionable(TRUE)
      ->setTranslatable(TRUE);

    return $fields;
  }

}
