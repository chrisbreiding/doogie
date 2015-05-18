import _ from 'lodash';
import { createFactory, createClass, PropTypes, DOM } from 'react';
import { Link as LinkComponent } from 'react-router';
import ReactStateMagicMixin from 'alt/mixins/ReactStateMagicMixin';
import HousesStore from '../houses/houses-store';
import houseActions from '../houses/houses-actions';
import SettingsStore from '../settings/settings-store';
import settingsActions from '../settings/settings-actions';
import { HOUSE_NAME_KEY } from '../lib/constants';
import { icon, directionsUrl } from '../lib/util';

const Link = createFactory(LinkComponent);

const MAP_EL_ID = 'google-maps-api';

export default createClass({
  mixins: [ReactStateMagicMixin],

  contextTypes: {
    router: PropTypes.func
  },

  statics: {
    registerStores: {
      houses: HousesStore,
      settings: SettingsStore
    }
  },

  componentDidMount () {
    this._markers = {};

    window.__mapsApiLoaded = this._mapsApiLoaded;
    this._loadScript();
  },

  componentWillUnmount () {
    houseActions.stopListening();
    settingsActions.stopListening();

    window.__mapsApiLoaded = null;
  },

  shouldComponentUpdate (__, nextState) {
    if (this.state.settings.visitField !== nextState.settings.visitField ||
        this.state.houses.houses.length !== nextState.houses.houses.length) {
      return true;
    }

    const oldAddresses = _.pluck(this.state.houses.houses, HOUSE_NAME_KEY);
    const newAddresses = _.pluck(nextState.houses.houses, HOUSE_NAME_KEY);
    return !_.isEmpty(_.difference(oldAddresses, newAddresses));
  },

  componentDidUpdate (__, prevState) {
    this._updateHouses(this.state.houses.houses, prevState.houses.houses);
  },

  _updateHouses (houses, prevHouses) {
    if (!this._map) return;

    const houseIds = _.reduce(houses, (memo, house) => {
      if (this._markers[house.id]) {
        this._updateHouse(house, _.findWhere(prevHouses, { id: house.id }));
      } else {
        this._addHouse(house);
      }

      memo[house.id] = true;
      return memo;
    }, {});

    _.each(_.keys(this._markers), (id) => {
      if (!houseIds[id]) this._removeHouse({ id });
    });
  },

  _loadScript () {
    if (this._scriptLoaded()) return this._mapsApiLoaded();

    let script = document.createElement('script');
    script.id = MAP_EL_ID;
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
        '&signed_in=true&callback=__mapsApiLoaded';
    document.body.appendChild(script);
  },

  _scriptLoaded () {
    return !!document.getElementById(MAP_EL_ID);
  },

  _mapsApiLoaded () {
    this._map = new google.maps.Map(this.refs.map.getDOMNode(), {
      zoom: 10,
      center: { lat: 40.0755702, lng: -75.28691950000001 }
    });

    houseActions.listen();
    settingsActions.listen();
    this._updateHouses(this.state.houses.houses);
  },

  _addHouse (house) {
    if (this._markers[house.id]) return;

    const marker = this._markers[house.id] = new google.maps.Marker({
      map: this._map,
      title: house[HOUSE_NAME_KEY],
      icon: {
        url: 'icons/map-icon.png',
        size: new google.maps.Size(46, 46),
        anchor: new google.maps.Point(11, 11),
        scaledSize: new google.maps.Size(23, 23)
      },
      position: { lat: 0, lng: 0 }
    });

    marker.addListener('click', () => {
      if (this._infoWindow) this._infoWindow.close();
      this._infoWindow = this._info(house.id);
      this._infoWindow.open(this._map, marker);
    });

    this._getLatLng(house[HOUSE_NAME_KEY], (location) => {
      marker.setPosition(location);
    });
  },

  _info (id) {
    const house = _.findWhere(this.state.houses.houses, { id });
    const visit = house[this.state.settings.visitField];
    const visitHtml = visit ? `<p>${visit}</p>` : '';

    return new google.maps.InfoWindow({
      content: `
        <div class="info">
          <h2>${house[HOUSE_NAME_KEY]}</h2>
          ${visitHtml}
          <p><a href="#/houses/${house.id}">View</a></p>
          <p><a href="${directionsUrl(house[HOUSE_NAME_KEY])}">Directions</a></p>
        </div>
      `
    });
  },

  _updateHouse (house, prevHouse) {
    if (prevHouse && house[HOUSE_NAME_KEY] === prevHouse[HOUSE_NAME_KEY]) return;

    this._markers[house.id].setTitle(house[HOUSE_NAME_KEY]);
    this._getLatLng(house[HOUSE_NAME_KEY], (location) => {
      this._markers[house.id].setPosition(location)
    });
  },

  _removeHouse (house) {
    this._markers[house.id].setMap(null);
    delete this._markers[house.id];
  },

  _getLatLng (address, cb) {
    const geo = new google.maps.Geocoder;

    geo.geocode({ address }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        const location = results[0].geometry.location;
        cb({ lat: location.lat(), lng: location.lng() });
      } else {
        console.log('failed to find', address, status)
      }
    });
  },

  render () {
    return DOM.div({ className: 'map full-screen' },
      DOM.header(null,
        Link({ to: 'menu' }, icon('chevron-left', 'Back')),
        DOM.h1()
      ),
      DOM.main({ ref: 'map' })
    );
  }
});
