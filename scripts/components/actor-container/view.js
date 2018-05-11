import $ from 'jquery';
import _ from 'underscore';
import Lateralus from 'lateralus';
import template from 'text!./template.mustache';

const Base = Lateralus.Component.View;
const baseProto = Base.prototype;

const ActorContainerComponentView = Base.extend({
  template,

  provide: {
    /**
     * @return {string}
     */
    actorHtml() {
      return $.trim(this.$actorWrapper.html());
    },
  },

  lateralusEvents: {
    /**
     * @param {boolean} isCentered
     */
    userRequestUpdateCenteringSetting(isCentered) {
      this.setCenteringClass(isCentered);
    },

    /**
     * @param {string} newHtml
     */
    userRequestUpdateActorHtml(newHtml) {
      this.$actorWrapper.html(newHtml);
    },
  },

  /**
   * @param {Object} [options] See http://backbonejs.org/#View-constructor
   */
  initialize() {
    baseProto.initialize.apply(this, arguments);

    // TODO: This should be emitting a context, not collecting an object and
    // augmenting it.
    this.actorModel = this.collectOne('currentActorModel');
    this.actorModel.setContext(this.$actorWrapper[0]);
    this.setCenteringClass(this.lateralus.model.getUi('centerToPath'));
  },

  /**
   * @param {boolean} isCentered
   */
  setCenteringClass(isCentered) {
    this.$actorWrapper[isCentered ? 'addClass' : 'removeClass']('centered');
  },

  /**
   * @override
   */
  getTemplateRenderData() {
    return _.extend(baseProto.getTemplateRenderData.apply(this, arguments), {
      embeddedImgRoot: this.lateralus.model.get('embeddedImgRoot'),
    });
  },
});

export default ActorContainerComponentView;
