<?php

namespace Drupal\react_block\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides an example block.
 *
 * @Block(
 *   id = "react_block",
 *   admin_label = @Translation("ReactBlock"),
 *   category = @Translation("react_block")
 * )
 */
class ReactBlock extends BlockBase {

    /**
     * {@inheritdoc}
     */
    public function build() {
        $build = [];

        $build[] = [
            '#markup' => '<div id="react-app"></div>',
            '#attributes' => [
                'id' => 'root',
            ],
            '#attached' => [
                'library' => [
                    'react_block/react_prod',
                ],
            ],
        ];

        return $build;
    }

}
