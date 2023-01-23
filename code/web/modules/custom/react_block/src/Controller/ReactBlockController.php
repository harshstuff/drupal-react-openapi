<?php

namespace Drupal\react_block\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Returns responses for react_block routes.
 */
class ReactBlockController extends ControllerBase {

  /**
   * Builds the response.
   */
  public function build() {

    $build['content'] = [
      '#type' => 'item',
      '#markup' => $this->t('It works!'),
    ];

    return $build;
  }

}
