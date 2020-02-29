AFRAME.registerComponent('cursor-listener', {
    init: function () {
      var lastIndex = -1;
      var COLORS = ['1 1 0', '0 1 0', '-1 1 0'];
      this.el.addEventListener('fusing', function (evt) {
        lastIndex = (lastIndex + 1) % COLORS.length;
        this.setAttribute('material', 'position', COLORS[lastIndex]);
        console.log('I was clicked at: ', evt.detail.intersection.point);
      });
    }
  });