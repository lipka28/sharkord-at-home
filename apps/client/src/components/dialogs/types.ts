export enum DialogType {
  Join = 'join',
  Leave = 'leave'
}

export type DialogPropsMap = {
  [DialogType.Join]: { a: number };
  [DialogType.Leave]: { reason: string };
};

export type TDialogBaseProps = {
  close: () => void;
  isOpen: boolean;
};
