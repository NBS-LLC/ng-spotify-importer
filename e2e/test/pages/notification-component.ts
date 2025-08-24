class NotificationComponent {
  get componentElement() {
    return $('#notification');
  }

  async waitForDisplayed() {
    return await this.componentElement.waitForDisplayed();
  }
}

export default new NotificationComponent();
