import { observable } from 'mobx'

class SettingsStore {
  @observable settings = observable.map({
    downPayment: '0',
    interestRate: '0',
    insuranceRate: '0',
    maxUpfrontCost: '0',
    pmiRate: '0',
    closingRate: '0',
    mortgageLengths: '30',
  })

  get (key) {
    return this.settings.get(key)
  }

  updateSetting = (props) => {
    this.settings.set(props.id, props.value)
  }
}

export const settingsStore = new SettingsStore()
