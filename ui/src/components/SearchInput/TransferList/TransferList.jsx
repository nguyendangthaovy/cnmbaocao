import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useSelector } from 'react-redux';
import { listFriendSelector } from '../../../store/reducers/friendReducer/friendReducer';
import { Avatar } from '@material-ui/core';

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
    return [...a, ...not(b, a)];
}

const TransferList = ({
    lsFr,
    left,
    setLeft,
    right,
    setRight,
    listIndex,
    setSearchInput,
    friendToCreateGroup,
    buttonRef,
}) => {
    // const lsFr = useSelector(listFriendSelector);
    const [checked, setChecked] = React.useState([]);
    // const [left, setLeft] = React.useState([]);
    // const [right, setRight] = React.useState([]);
    // const friendToCreateGroup = [];
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    React.useEffect(() => {
        if (lsFr) {
            setLeft(Array.from({ length: lsFr.length }, (_, i) => i));
        }
    }, [lsFr]);

    React.useEffect(() => {
        const lsFrToCreate = [];
        for (let i of friendToCreateGroup) {
            friendToCreateGroup.splice(i, 1);
        }
        for (let i of right) {
            lsFrToCreate.push(lsFr[i]._id);
        }
        friendToCreateGroup.push(...lsFrToCreate);

        // listIndex.current = [...left];
    }, [right]);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };
    // console.log(friendToCreateGroup);
    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        listIndex.current = [...not(left, leftChecked)];
        setRight(right.concat(leftChecked));
        // setLeft(not(left, leftChecked));

        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        listIndex.current = [...listIndex.current, ...rightChecked];
        setLeft(listIndex.current);
        // setLeft(left.concat(rightChecked));
        setSearchInput('');
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const customList = (title, items) => (
        <Card>
            <CardHeader
                sx={{ px: 2, py: 1 }}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                        disabled={items.length === 0}
                        inputProps={{
                            'aria-label': 'all items selected',
                        }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} đã chọn`}
            />
            <Divider />
            <List
                sx={{
                    height: 450,
                }}
                dense
                component="div"
                role="list"
                className="scrollbar"
                id="style-scroll"
            >
                {items.map((value) => {
                    const labelId = `transfer-list-all-item-${value}-label`;

                    return (
                        <ListItem
                            className="listFriend"
                            sx={{
                                width: 250,
                            }}
                            key={value}
                            role="listitem"
                            button
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <Avatar
                                style={{ width: '30px', height: '30px', marginRight: '10px' }}
                                src={lsFr[value] !== undefined ? lsFr[value].avatar : ''}
                            />
                            <ListItemText id={labelId} primary={lsFr[value] !== undefined ? lsFr[value].name : ''} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Card>
    );

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item>{customList('Lựa chọn', left)}</Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Grid>
            </Grid>
            <Grid item>{customList('Chosen', right)}</Grid>
        </Grid>
    );
};

export default TransferList;
