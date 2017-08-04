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

      $label = $('label[for="' + $target.attr('id') + '"]');
      if (!$label.length) return;

      $label[action + 'Class']('form-control-has-focus');
    }
  }

  function handleFloatingLabelControlHasValue(action) {
    return function (evt) {
      var $target = $(evt.target);
      var $label;

      if (!$target.hasClass('form-control')) return;

      var $formGroup = $target.parent('.form-group.floating-label-control');
      if (!$formGroup.length) return;

      if (action === 'add') $formGroup.addClass('has-value');
      if (action === 'remove' && $target.val() === '') {
        $formGroup.removeClass('has-value');
      }
    }
  }

  function initFloatingLabelContrlHasValue() {
    var $floatingLabelFormGroups =
      $(document).find('.form-group.floating-label-control');

    $floatingLabelFormGroups.each(function (idx, el) {
      var $input = $(el).find('.form-control');
      if ($input.val()) $(el).addClass('has-value');
    });
  }

  $(document).on('focusin', handleFormControlHasFocusClassOnLabel('add'));
  $(document).on('focusout', handleFormControlHasFocusClassOnLabel('remove'));

  $(document).on('focusin', handleFloatingLabelControlHasValue('add'));
  $(document).on('focusout', handleFloatingLabelControlHasValue('remove'));

  $(document).ready(initFloatingLabelContrlHasValue);
}(jQuery);

