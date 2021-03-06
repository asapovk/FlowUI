import useStyleProps from '@flow-ui/core/misc/hooks/useStyleProps';
import Types from './types'
import Shared from '../../types';

const rangeStyles: Shared.FunctionalComponentStyles<Types.Overrides> = (props: Types.Props, theme) => {
    const stylesProps = useStyleProps(props)

    return {
        container: [
            {
                position: 'relative',
                minWidth: '4rem',
                height: 'calc(1rem + 4px)',
                cursor: 'pointer',
            },
            stylesProps.all,
        ],
        rail: [{
            position: 'absolute',
            top: 'calc(50% - 2px)',
            height: '4px',
            background: theme.color.lightest.css(),
            width: '100%',
            zIndex: 1,
            borderRadius: '2px',
        }],
        track: [{
            position: 'absolute',
            top: 'calc(50% - 2px)',
            height: '4px',
            background: theme.color.primary.css(),
            zIndex: 2,
            borderRadius: '2px',
        }],
        thumb: [{
            position: 'absolute',
            width: '1rem',
            height: '1rem',
            borderRadius: '1rem',
            marginLeft: 'calc(-.5rem - 2px)',
            background: theme.color.surface.css(),
            borderColor: theme.assets.border.color,
            borderStyle: theme.assets.border.style,
            borderWidth: theme.assets.border.width,
            boxShadow: theme.assets.shadow.short,
            border: '2px solid ' + theme.color.primary.css(),
            zIndex: 3,
            transition: 'transform 0.25s',
            ':hover': {
                transform: 'scale(1.05)'
            },
            ':active': {
                transform: 'scale(0.95)'
            }
        }],
    }
}

export default rangeStyles