import React, { Fragment, useState } from 'react';
import { Menu, Icon, Block } from '@flow-ui/core';

export default () => {
    const [value, setValue] = useState(0);
    return (
        <Fragment>
            <Menu
                ml={"0.5rem"}
                mr={"0.5rem"}
                mb={'-1px'}
                decoration="tab"
                value={value}
                items={[
                    { value: 0, content: 'Zero' },
                    { value: 1, content: 'One' },
                    { value: 2, content: 'Two' },
                ]}
                onChange={(e: number) => setValue(e)}
            />
            <Block surface='major' p="1rem">
                Active tab: {value}
            </Block>
        </Fragment>
    )
}