+function ($) {
  'use strict';

  //
  // adds/removes the class 'form-control-has-focus' on a control label
  // if the corresponding form control receives/misses focus
  //
  function handleFormControlHasFocusClassOnLabel(action) {
    return function (evt) {
      var $target = $(evt.target);
      var $label;

      if (!$target.hasClass('form-control')) return;
      if (!$target.attr('id')) return;

      $label = $('label[for=' + $target.attr('id') + ']');
      if (!$label.length) return;

      $label[action + 'Class']('form-control-has-focus');
    }
  }

  $(document).on('focusin', handleFormControlHasFocusClassOnLabel('add'));
  $(document).on('focusout', handleFormControlHasFocusClassOnLabel('remove'));

}(jQuery);

