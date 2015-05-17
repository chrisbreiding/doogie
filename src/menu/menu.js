import { createClass, createFactory, DOM } from 'react';
import { Link as LinkComponent } from 'react-router';
import auth from '../auth/auth';
import HousesListComponent from '../houses/houses-list';
import MenuGroupComponent from './menu-group';

const Link = createFactory(LinkComponent);
const HousesList = createFactory(HousesListComponent);
const MenuGroup = createFactory(MenuGroupComponent);

export default createClass({
  render () {
    return DOM.ul({ className: 'menu full-screen' },
      MenuGroup(null,
        DOM.li({ className: 'houses-link' }, Link({ to: 'houses' },
          DOM.i({ className: 'fa fa-home' }), 'All houses'
        )),
        DOM.li(null, Link({ to: 'map' },
          DOM.i({ className: 'fa fa-map-marker' }), 'Map'
        ))
      ),
      HousesList(),
      MenuGroup(null, DOM.li(null,
        Link({ to: 'house', params: { id: 'new' }},
          DOM.i({ className: 'fa fa-plus' }), 'Add house'
        )
      )),
      MenuGroup(null, DOM.li(null,
        Link({ to: 'settings' },
          DOM.i({ className: 'fa fa-cog' }), 'Settings'
        )
      )),
      MenuGroup(null, DOM.li(null,
        Link({ to: 'logout' },
          DOM.i({ className: 'fa fa-sign-out' }), 'Logout'
        )
      ))
    );
  }
});
