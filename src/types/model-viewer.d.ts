declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
          src?: string;
          alt?: string;
          'camera-controls'?: boolean | string;
          'auto-rotate'?: boolean | string;
          'auto-rotate-delay'?: number | string;
          'rotation-per-second'?: string;
          'camera-orbit'?: string;
          'camera-target'?: string;
          'field-of-view'?: string;
          'shadow-intensity'?: number | string;
          'shadow-softness'?: number | string;
          exposure?: number | string;
          'environment-image'?: string;
          'interaction-prompt'?: string;
          slot?: string;
          ref?: React.Ref<HTMLElement>;
          style?: React.CSSProperties;
          children?: React.ReactNode;
        };
      }
    }
  }
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        'camera-controls'?: boolean | string;
        'auto-rotate'?: boolean | string;
        'auto-rotate-delay'?: number | string;
        'rotation-per-second'?: string;
        'camera-orbit'?: string;
        'camera-target'?: string;
        'field-of-view'?: string;
        'shadow-intensity'?: number | string;
        'shadow-softness'?: number | string;
        exposure?: number | string;
        'environment-image'?: string;
        'interaction-prompt'?: string;
        slot?: string;
        ref?: React.Ref<HTMLElement>;
        style?: React.CSSProperties;
        children?: React.ReactNode;
      };
    }
  }
}

export {};

