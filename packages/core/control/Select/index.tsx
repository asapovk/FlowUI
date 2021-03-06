import React, { forwardRef, useReducer, useRef, Fragment, useImperativeHandle, useEffect } from 'react'
import Types from './types'
import selectStyles from './styles'
import Field from '../../misc/hocs/Field'
import Icon from '../../content/Icon'
import Drop from '../../layout/Drop'
import DropTypes from '../../layout/Drop/types'
import SelectReducer from './reducer'
import useContainer from '../../misc/hooks/useContainer'
import useStyles from '../../misc/hooks/useStyles'

const Select = (props: Types.Props, ref) => {

    const {
        shape = 'rounded',
        decoration = 'outline', 
        size = 'medium',
        multiselect,
        onChange,
        options = [],
        values,
        defaultValues = [],
        placeholder,
        searchable,
        disabled,
        label,
        tabIndex = 0
    } = props

    let approvedDefaultValues = defaultValues 
        ? options.filter(option => includeOption(defaultValues, option)) 
        : []

    if (!multiselect && approvedDefaultValues.length != 0) {
        approvedDefaultValues = [approvedDefaultValues[0]]
    }

    const initialState: Types.State = {
        selectedOptions: approvedDefaultValues,
        open: false,
        searchValue: '',
        empty: approvedDefaultValues.length === 0,
        cursor: -1
    }

    const targetRef = useRef(null)
    const dropRef = useRef<DropTypes.Ref>(null)
    const [state, dispatch] = useReducer(SelectReducer, initialState)

    const {attributes, focus} = useContainer(props, true, props.decoration != 'none')
    const isLabelOutside = ['outline', 'filled'].includes(decoration) && !(size === 'xlarge')
    const isLabelOverlay = (label && state.empty && !focus && !isLabelOutside) ? true : false
    const styles = useStyles<Types.Overrides>(props, selectStyles, 'Select')

    useImperativeHandle(ref, () => {
        return targetRef.current
    })

    useEffect(() => {
        if (values) {
            dispatch({type: 'setSelectedOptions', payload: values})
        }
    }, [values])

    const availableOptions = getAvailableOptions(
        options,
        state.selectedOptions,
        state.searchValue,
    )

    function toggleOpen() {
        if (state.open) {
            dispatch({type: 'toggleOpen', payload: false})
        } else if(!disabled && availableOptions.length != 0) {
            dispatch({type: 'toggleOpen', payload: true})
        }      
    }

    function toggleOption (option: Types.Option) {
        const empty: Types.Option[] = []
        let nextSelectedOptions = state.selectedOptions
        if (multiselect) {
            includeOption(state.selectedOptions, option)
                ? nextSelectedOptions = state.selectedOptions.filter(selectedOption =>
                    selectedOption.value != option.value
                )
                : nextSelectedOptions.push(option)
        } else {
            nextSelectedOptions = [option]
        }
        !values && dispatch({type: 'setSelectedOptions', payload: nextSelectedOptions})
        onChange?.(empty.concat(nextSelectedOptions), option)
        setTimeout(() => dropRef?.current?.updatePosition())
    }

    function reduceSelectedOptions () {
        const empty: Types.Option[] = []
        const nextSelectedOptions = state.selectedOptions.slice(0, -1)
        !values && dispatch({type: 'setSelectedOptions', payload: nextSelectedOptions})
        onChange?.(empty.concat(nextSelectedOptions) as Types.Option[])
        setTimeout(() => dropRef?.current?.updatePosition())
    }

    function clear () {
        !values && dispatch({type: 'clear'})
        onChange?.([])
        setTimeout(() => dropRef?.current?.updatePosition())
    }
                
    /*
    * Keyboard control
    */
    function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
        switch (event.key) {
            case 'Enter':
                if (state.cursor != -1) {
                    toggleOption(availableOptions[state.cursor])
                }
                dispatch({ type: 'toggleOpen', payload: !state.open })
                break
            case 'ArrowUp':
                event.preventDefault()
                state.cursor > 0 && dispatch({
                    type: 'setCursor',
                    payload: state.cursor - 1
                })
                break
            case 'ArrowDown':
                event.preventDefault()
                state.cursor < availableOptions.length - 1 && dispatch({
                    type: 'setCursor',
                    payload: state.cursor + 1
                })
                break
            case 'Backspace':
                !searchable || !state.searchValue && reduceSelectedOptions()
                break
        }
        props.onKeyDown && props.onKeyDown(event)
    }

    function handleSearch (value) {
        dispatch({ type: 'search', payload: value })
        const nextAvailableOptions = getAvailableOptions(
            options,
            state.selectedOptions,
            value,
        )

        if (nextAvailableOptions.length != 0) {
            !state.open && dispatch({ type: 'toggleOpen', payload: true })
        } else {
            state.open && dispatch({ type: 'toggleOpen', payload: false })
        }
    }
    
    /*
    * Set field value
    */
    let fieldValue = <span css={styles.placeholder}>{placeholder}</span>

    if (multiselect && (!state.empty || searchable)) {
        fieldValue =
            <Options
                styles={styles}
                selected={state.selectedOptions}
                searchable={searchable}
                disabled={disabled}
                placeholder={state.empty ? placeholder : ''}
                searchValue={state.searchValue}
                onSearch={handleSearch}
                onClose={(option) => toggleOption(option)}
            />
    }

    if (!multiselect) {
        if (searchable) {
            fieldValue =
                <Search
                    styles={styles}
                    disabled={disabled}
                    placeholder={placeholder}
                    searchValue={state.empty 
                        ? state.searchValue 
                        : state.selectedOptions[0].text
                    }
                    onSearch={handleSearch}
                />
        } else if (!state.empty) {
            fieldValue = <span>{state.selectedOptions[0].text}</span>
        }
    }

    return (
        <Fragment>
            <Field
                {...props}
                ref={targetRef}

                focus={focus}
                styles={styles}
                state={state}
                isLabelOutside={isLabelOutside}
                isLabelOverlay={isLabelOverlay}
                decoration={decoration}
                size={size}
                shape={shape}
                onClear={() => clear()}
                
                attributes={{
                    ...attributes,
                    tabIndex: props.tabIndex,
                    onClick: (e) => {
                        searchable && e.target.toString() === '[object HTMLInputElement]'
                            ? !state.open && dispatch({ type: 'toggleOpen', payload: true })
                            : toggleOpen()
                        props.onClick && props.onClick(e)
                    },
                    onKeyDown: (e) => handleKeyDown(e)
                }}                

                children={!isLabelOverlay && fieldValue}

                rightChild={(
                    <Icon
                        type={i =>
                            i.filled[state.open ? 'arrowIosUpward' : 'arrowIosDownward']
                        }
                        onClick={(e) => {
                            e.stopPropagation()
                            toggleOpen()
                        }}
                    />
                )}
            />
            <Drop
                visibility={state.open ? 'visible' : 'hidden'}
                ref={dropRef}
                onClickOutside={(e, ot) => {
                    ot && state.open && dispatch({type: 'toggleOpen', payload: false})
                }}
                stretchWidth
                justify="start"
                target={targetRef}
                children={(
                    <div css={styles.dropMenu({decoration, focus})}>
                        {availableOptions
                            .map((option, i) => (
                                <div
                                    key={option.value}
                                    css={styles.dropItem({underCursor: i === state.cursor, size})}
                                    children={option.text}
                                    onMouseDown={(e) => {
                                        toggleOption(option)
                                        !multiselect && state.open && dispatch({type: 'toggleOpen', payload: false})
                                    }}
                                />
                            ))}
                    </div>
                )}
            />
        </Fragment>
    )
}

const Options = (props: Types.OptionsProps ) => {

    const { selected, onClose, styles, searchable } = props

    return (
        <div css={styles.options}>
            {selected.map(option => (
                <div key={option.value} css={styles.optionItem}>
                    <span css={styles.optionItemText}>{option.text}</span>
                    <Icon
                        type={(i) => i.outline.close}
                        onClick={(e) => {
                            e.stopPropagation()
                            onClose(option)
                        }}
                    />
                </div>
            ))}
            {searchable && <Search {...props} size={4} />}
        </div>
    )
}

const Search = (props: Types.SearchProps) => {
    const { searchValue, onSearch, styles, defaultValue, placeholder, disabled } = props

    return (
        <input
            defaultValue={defaultValue}
            placeholder={placeholder}
            disabled={disabled}
            value={searchValue}
            css={styles.input}
            size={props.size}
            autoFocus
            onChange={e => onSearch(e.target.value)}
        />
    )
}

function getAvailableOptions(options: Types.Option[], selectedOptions: Types.Option[], search: string) {
    return options.filter(option =>
        !includeOption(selectedOptions, option) &&
        option.text
            .toLocaleUpperCase()
            .includes(search.toLocaleUpperCase())
    )
}

function includeOption(options: Types.Option[], option: Types.Option) {
    let includes = false
    options.map(o => {
        if(o.value === option.value) {
            includes = true
        }
    })
    return includes
}
export default forwardRef(Select)