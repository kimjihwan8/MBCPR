// types/react-native-event-source.d.ts
declare module "react-native-event-source" {
  export interface EventSourceOptions {
    headers?: Record<string, string>;
    [key: string]: any;
  }

  export default class RNEventSource {
    constructor(url: string, options?: EventSourceOptions);
    addEventListener(event: string, callback: (event: any) => void): void;
    removeEventListener(event: string, callback: (event: any) => void): void;
    close(): void;
  }
}
