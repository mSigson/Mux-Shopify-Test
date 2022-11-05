import {EnhancedMenu} from '~/lib/utils';
import {Text} from '~/components';
import {Drawer} from './Drawer.client';
import {Link} from '@shopify/hydrogen';
import {startTransition} from 'react';

export function MenuDrawer({
  isOpen,
  onClose,
  menu,
  merchantIsLive,
}: {
  isOpen: boolean;
  onClose: () => void;
  menu: EnhancedMenu;
  merchantIsLive: boolean;
}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
      <div className="grid">
        <MenuMobileNav
          menu={menu}
          onClose={onClose}
          merchantIsLive={merchantIsLive}
        />
      </div>
    </Drawer>
  );
}

function MenuMobileNav({
  menu,
  onClose,
  merchantIsLive,
}: {
  menu: EnhancedMenu;
  onClose: () => void;
  merchantIsLive: boolean;
}) {
  return (
    <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
      {/* Top level menu items */}
      {(menu?.items || []).map((item) => (
        <Link
          key={item.id}
          to={item.to}
          target={item.target}
          onClick={() => startTransition(onClose)}
        >
          <Text as="span" size="copy">
            {item.title}
          </Text>
        </Link>
      ))}
      {merchantIsLive && (
        <Link className="font-bold" to="/live">
          Watch Live
          <svg
            className="h-6 w-6 ml-2 flex-none inline-block"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="11" fill="red" />
          </svg>
        </Link>
      )}
    </nav>
  );
}
