// This file extends the AdapterConfig type from "@types/iobroker"

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
  namespace ioBroker {
    interface AdapterConfig {
      del_old_livestream: boolean;
      auto_livestream: boolean;
      save_livestream: number;
      filename_livestream: string;
      path_livestream: string;
      overlay_Livestream: boolean;
      recordtime_livestream: number;
      recordtime_auto_livestream: number;

      del_old_snapshot: boolean;
      auto_snapshot: boolean;
      save_snapshot: number;
      filename_snapshot: string;
      path_snapshot: string;
      overlay_snapshot: boolean;

      del_old_HDsnapshot: boolean;
      auto_HDsnapshot: boolean;
      save_HDsnapshot: number;
      filename_HDsnapshot: string;
      path_HDsnapshot: string;
      overlay_HDsnapshot: boolean;
      sharpen_HDsnapshot: number;
      night_sharpen_HDsnapshot: boolean;
      contrast_HDsnapshot: number;
      night_contrast_HDsnapshot: boolean;

      ignore_events_Motion: number;
      ignore_events_Doorbell: number;
      keep_ignoring_if_retriggered: boolean;
      pollsec: number;
      refreshtoken: string;
      twofaceauth: boolean;
      renew_registration: number;
    }
  }
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export {};
