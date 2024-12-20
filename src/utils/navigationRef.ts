import {
  createNavigationContainerRef,
  ParamListBase,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<ParamListBase>();

export function navigate(
  name: keyof ParamListBase,
  params?: Record<string, any>,
): void {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
