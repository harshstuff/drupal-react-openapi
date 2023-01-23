const PRIMARY_LINK_CLASS = ".alb--link";

/**
 * AccessibleLinkBox
 */
export default class AccessibleLinkBox {
  /**
   * constructor
   */
  constructor(element) {
    element.addEventListener("mousedown", this.handleMouseDown);
    element.addEventListener("mouseup", this.handleMouseUp);
    this.link = element.querySelector(PRIMARY_LINK_CLASS);

    element.addEventListener("click", event => {});
  }

  /**
   * handleMouseDown
   */
  handleMouseDown = event => {
    this.downTimestamp = new Date();
  };

  /**
   * handleMouseUp
   */
  handleMouseUp = event => {
    let upTimestamp = new Date();
    if (upTimestamp - this.downTimestamp < 200) {
      if (!event.target.href) {
        this.link.click();
      }
    }
  };
}
