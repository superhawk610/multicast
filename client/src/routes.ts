import { Devices } from './pages/Devices';
import { Configuration } from './pages/Configuration';
import { Channels } from './pages/Channels';
import { ManageChannel } from './pages/ManageChannel';

export interface RouteConfiguration {
  name: string;
  path: string;
  exact?: boolean;
  component: any;
  displayInSidebar?: boolean;
}

interface Routes {
  [routeName: string]: RouteConfiguration;
}

const routes: Routes = {
  Devices: {
    name: 'Devices',
    path: '/devices',
    exact: true,
    component: Devices,
    displayInSidebar: true,
  },
  Channels: {
    name: 'Channels',
    path: '/channels',
    exact: true,
    component: Channels,
    displayInSidebar: true,
  },
  ManageChannel: {
    name: 'Manage Channels',
    path: '/channels/:id',
    component: ManageChannel,
  },
  Configuration: {
    name: 'Configuration',
    path: '/configuration',
    exact: true,
    component: Configuration,
    displayInSidebar: true,
  },
};

export default routes;
