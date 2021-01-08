import {
  IColorConfigType,
  INumberConfigType,
  ITextConfigType,
  TColorDefaultType,
  TNumberDefaultType,
  TTextDefaultType,
  IInteractionConfigType,
} from '../../../../core/FormComponents/types';
import { BaseSchema } from '../../common';
import logo from '@/assets/16-botton.png';

export type TButtonEditData = Array<
  | ITextConfigType
  | IColorConfigType
  | INumberConfigType
  | IInteractionConfigType
>;

export interface IButtonConfig {
  tplImg: string;
  round: TNumberDefaultType;
  text: TTextDefaultType;
  bgColor: TColorDefaultType;
  color: TColorDefaultType;
  fontSize: TNumberDefaultType;
  width: TNumberDefaultType;
  marginTop: TNumberDefaultType;
}

export interface IButtonSchema extends BaseSchema {
  editData: TButtonEditData;
  config: IButtonConfig;
}
const Button: IButtonSchema = {
  type: 'XButton',
  category: 'base',
  displayName: '按钮组件',
  editData: [
    {
      key: 'bgColor',
      name: '背景色',
      type: 'Color',
    },
    {
      key: 'width',
      name: '宽度',
      type: 'Number',
    },
    {
      key: 'marginTop',
      name: '上边距',
      type: 'Number',
    },
    {
      key: 'round',
      name: '圆角',
      type: 'Number',
    },
    {
      key: 'text',
      name: '按钮文字',
      type: 'Text',
    },
    {
      key: 'color',
      name: '文字颜色',
      type: 'Color',
    },
    {
      key: 'fontSize',
      name: '文字大小',
      type: 'Number',
    },
  ],
  config: {
    tplImg: logo,
    bgColor: 'rgba(22,40,212,1)',
    width: 190,
    marginTop: 0,
    round: 16,
    text: '按钮',
    fontSize: 15,
    color: 'rgba(255,255,255,1)',
  },
};
export default Button;
