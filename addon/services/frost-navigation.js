import Ember from 'ember'
import A from 'ember-frost-navigation/utils/asserts'

const {
  Service,
  inject,
  assert,
  deprecate,
  Logger
} = Ember

export default Service.extend({
  routing: inject.service('-routing'),
  _controller: null,
  _activeCategory: null,
  categories: Ember.A(),
  _registerCategory (config = {}) {
    assert(A.categoryName, config.name)
    let category = this.categories.find(e => e.name === config.name)
    if (!category) {
      this.categories.pushObject(category = {
        name: config.name,
        icon: config.icon,
        pack: config.pack,
        columns: config.columns || [],
        isVisible: config.isVisible
      })
    }
    return category
  },
  dismiss () {
    this.set('_activeCategory', null)
  },
  transitionTo (route) {
    try {
      this.get('routing').transitionTo(route)
    } catch (e) {
      Logger.warn('Unable to perform transition', e)
    }
    this.dismiss()
  },
  performAction (item) {
    let controller = this.get('_controller')

    if (item.dismiss) {
      this.dismiss()
    }

    try {
      controller.send(item.action, item)
    } catch (e) {
      let actionHandler = controller.get(item.action)
      if (actionHandler && typeof actionHandler === 'function') {
        deprecate(A.depAction, false, {
          id: 'ember-frost-navigation',
          until: '*'
        })
        actionHandler.call(controller, item)
      } else {
        throw e
      }
    }
  }
})
