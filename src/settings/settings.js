import { createFactory, createClass, DOM } from 'react';
import { Link as LinkComponent, RouteHandler as RouteHandlerComponent } from 'react-router';
import MenuGroupComponent from '../menu/menu-group';
import FieldsComponent from '../fields/fields';

const Link = createFactory(LinkComponent);
const MenuGroup = createFactory(MenuGroupComponent);
const RouteHandler = createFactory(RouteHandlerComponent);
const Fields = createFactory(FieldsComponent);

export default createClass({
  render () {
    return DOM.div(null,
      DOM.div({ className: 'settings full-screen' },
        DOM.header(null,
          Link({ to: 'menu' }, DOM.i({ className: 'fa fa-chevron-left' }), 'Back'),
          DOM.h1(null, 'Settings')
        ),
        DOM.main(null,
          DOM.label(null, 'Fields'),
          DOM.ul({ className: 'menu' }, Fields()),
          MenuGroup(null, DOM.li(null, Link({ to: 'new-field' },
            DOM.i({ className: 'fa fa-plus' }),
            ' Add field'
          )))
        )
      ),
      RouteHandler()
    );
  }
});
