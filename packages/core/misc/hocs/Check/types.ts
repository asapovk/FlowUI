import Global from "@flow-ui/core/types";

declare namespace CheckTypes {

    type CheckType = 'checkbox' | 'radio' | 'switch'

    export interface Props extends Global.Props {
        label?: string
        labelColor?: Global.ColorProp
        type?: CheckType
        checked?: boolean
        disabled?: boolean
        onChange?: (checked: boolean) => void
        defaultValue?: boolean
        uppercase?: boolean
        size?: Global.Size
        children: (checked: boolean, focus: boolean) => React.ReactElement
    }
}

export default CheckTypes;