import {
  IColorConfigType,
  INumberConfigType,
  ITextConfigType,
  TColorDefaultType,
  TNumberDefaultType,
  IRichTextConfigType,
  TRichTextDefaultType,
} from '../../../../core/FormComponents/types';
import { BaseSchema } from '../../common';
import logo from '@/assets/richText@2x.png';

export type TButtonEditData = Array<
  ITextConfigType | IColorConfigType | INumberConfigType | IRichTextConfigType
>;

export interface IButtonConfig {
  tplImg: string;
  round: TNumberDefaultType;
  borderWidth: TNumberDefaultType;
  padding: TNumberDefaultType;
  borderColor: TColorDefaultType;
  content: TRichTextDefaultType;
}

export interface IButtonSchema extends BaseSchema {
  editData: TButtonEditData;
  config: IButtonConfig;
}
const Button: IButtonSchema = {
  type: 'RichText',
  category: 'base',
  displayName: '富文本组件',
  editData: [
    {
      key: 'round',
      name: '边框圆角',
      type: 'Number',
    },
    {
      key: 'borderWidth',
      name: '边框宽度',
      type: 'Number',
    },
    {
      key: 'borderColor',
      name: '边框颜色',
      type: 'Color',
    },
    {
      key: 'padding',
      name: '内边距',
      type: 'Number',
    },
    {
      key: 'content',
      name: '内容',
      type: 'RichText',
    },
  ],
  config: {
    tplImg: logo,
    round: 0,
    borderWidth: 0,
    borderColor: 'rgba(255,255,255,1)',
    padding: 0,
    content: '富文本内容',
  },
};
export default Button;
