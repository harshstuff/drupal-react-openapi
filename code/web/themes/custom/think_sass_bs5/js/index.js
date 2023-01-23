import "../scss/index.scss";
import AccessibleLinkBox from "./AccessibleLinkBox/AccessibleLinkBox";
import { AnimateOnScroll } from "./AnimateOnScroll/AnimateOnScroll";

/**
 * @file
 * Global utilities.
 *
 */
(function ($, Drupal) {
  "use strict";

  Drupal.behaviors.think_sass_bs5 = {
    attach: function (context, settings) {
      // Custom code here
      context.querySelectorAll(".alb").forEach((element) => {
        new AccessibleLinkBox(element);
      });
    
      AnimateOnScroll(context);
    },
  };
})(jQuery, Drupal);
