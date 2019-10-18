import useContainer from '@flow-ui/core/misc/hooks/useContainer';
import React, { FC, forwardRef, Fragment, useState } from 'react';
import createID from '../../misc/utils/createID';
import Item from './Item';
import getStyles from './styles';
import MenuTypes from './types';

const Menu: FC<MenuTypes.Props> = (props, ref) => {
    const { items, defaultValue = '', separator } = props;
    const { attributes } = useContainer(props);
    const styles = getStyles(props);
    const [value, setValue] = useState<MenuTypes.Value>(defaultValue);
    const currentValue = (typeof props.value === 'undefined' || props.value === '')
        ? value
        : props.value

    function handleSwitch(item: MenuTypes.Item) {
        if (!item.disabled) {
            if (!props.value) {
                setValue(item.value);
            }
            props.onChange && props.onChange(item.value);
        }
    }

    if (!items || !Array.isArray(items)) return null

    return (
        <div
            {...attributes}
            ref={ref}
            css={styles.container}
        >
            {items.map((item, i) => {
                return (
                    <Fragment key={createID()}>
                        <Item
                            {...item}
                            active={item.value === currentValue}
                            onClick={() => handleSwitch(item)}
                            onEnter={() => handleSwitch(item)}
                            styles={styles}
                        />
                        {separator && i + 1 < items.length && (
                            <div css={styles.separator}>
                                {separator}
                            </div>
                        )}
                    </Fragment>
                )
            })}
        </div>
    )
}

export default forwardRef(Menu);