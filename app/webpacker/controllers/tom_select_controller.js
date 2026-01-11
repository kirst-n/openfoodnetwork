import { Controller } from "stimulus";
import TomSelect from "tom-select/dist/esm/tom-select.complete";

export default class extends Controller {
  static values = { options: Object, placeholder: String, emptyResultsMessage: String, loadOnFocus: Boolean };

  connect(options = {}) {
    this.control = new TomSelect(this.element, {
      maxItems: 1,
      maxOptions: null,
      plugins: ["dropdown_input"],
      allowEmptyOption: true, // Show blank option (option with empty value)
      placeholder: this.placeholderValue || this.#emptyOption(),
      onItemAdd: function () {
        this.setTextboxValue("");
      },
      shouldLoad: (query) => this.loadOnFocusValue ? true : query.length > 1,
      ...this.optionsValue,
      ...options,
      render: {
        no_results: this.#renderNoResultsDropdownMessage,
        ...(options.render || {})
      }
    });
  }

  disconnect() {
    if (this.control) this.control.destroy();
  }

  // private

  #emptyOption() {
    const optionsArray = [...this.element.options];
    return optionsArray.find((option) => [null, ""].includes(option.value))?.text;
  }

  #renderNoResultsDropdownMessage() {
    const emptyResultsMessage = this.emptyResultsMessageValue || I18n.t("admin.select2.no_matches");

    return '<div class="no-results">' + emptyResultsMessage + '</div>';
  }
}
