import Global from '@flow-ui/core/types';
import CSS from 'csstype';
import { Interpolation } from '@emotion/core';

declare namespace PopoverTypes {
    export interface Props extends Global.Props {
        align?: "top" | "bottom" | "left" | "right"
        background?: Global.ColorProp
        color?: Global.ColorProp
        children?: React.ReactNode
        arrowWidth?: CSS.Properties["width"]
        arrowHeight?: CSS.Properties["height"]
    }

    export interface Styles {
        container?: Interpolation
        arrow?: Interpolation
    }
}

export default PopoverTypes