import { createClass, createFactory, DOM } from 'react';
import { Link as LinkComponent } from 'react-router';
import auth from '../auth/auth';
import HousesComponent from '../houses/houses';
import MenuGroupComponent from './menu-group';

const Link = createFactory(LinkComponent);
const Houses = createFactory(HousesComponent);
const MenuGroup = createFactory(MenuGroupComponent);

export default createClass({
  render () {
    return DOM.ul({ className: 'menu full-screen' },
      Houses(),
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
