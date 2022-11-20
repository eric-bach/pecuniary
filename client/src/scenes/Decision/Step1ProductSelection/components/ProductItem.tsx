import { Box, Button, Card, Collapse, FormControl, FormControlLabel, Radio, RadioGroup, TextField, Tooltip, Typography } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { InsetSpacing } from "components/Spacing";
import React, { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { Product } from "services/redux/actionsAndSlicers/ProductSlice";

export type ProductItemProps = {
    product: Product
    actionComponent?: React.ReactNode
}

function formatCurrency(num: number) {
    return num?.toLocaleString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}

const ProductItem = (props: ProductItemProps) => {
    const {
        product,
        actionComponent
    } = props
    const [expanded, setExpanded] = useState(false)

    const imageComponent = <span style={{ display: 'flex', flex: 1, position: 'relative' }}>
        <img
            alt={product.thumbnail_url}
            src={product.thumbnail_url}
            style={{
                height: 'auto',
                width: '100%',
                objectFit: 'cover',
                aspectRatio: '3/2'
            }}
        />
    </span>

    const expand = {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
    }

    const expandOpen = {
        transform: 'rotate(180deg)',
        marginLeft: 'auto',
    }

    const [count, setCount] = useState(1);
    const IncNum = () => {
        setCount(count + 1);
    };
    const DecNum = () => {
        if (count > 1) { setCount(count - 1); }
        else {
            setCount(1);
            alert("min limit reached");
        }
    };
    return (<Card elevation={2} style={{ minHeight: '100%' }}>
        <InsetSpacing scale={3}>
            <Typography align="center" color="textPrimary" variant="h5">
                {product.name}
            </Typography>
        </InsetSpacing>
        {imageComponent}
        <InsetSpacing scale={3}>
            <Box mb={3} display={'flex'} alignItems={'flex-start'} justifyContent={'center'}>
                <Typography
                    variant="h5"
                    color="textPrimary"
                    style={{ fontSize: 36, lineHeight: '120%' }}
                >
                    {formatCurrency(product.price)}
                </Typography>
                <Typography style={{ lineHeight: '150%' }} variant="h6">
                    VND
                </Typography >
            </Box>
            <Box mb={3} display={'flex'} alignItems={'flex-start'} justifyContent={'center'}>
                <Tooltip title="Delete">
                    <Button variant="contained" onClick={IncNum}>
                        <AddIcon />
                    </Button>
                </Tooltip>
                <TextField variant="outlined" style={{ 'width': '50px', 'margin': '0 10px' }} size="small" InputProps={{
                    inputProps: {
                        style: { textAlign: "center" },
                    }
                }} disabled value={count} />
                <Button variant="contained" onClick={DecNum}>
                    <RemoveIcon />
                </Button>
            </Box>
            {product?.options && <Box mb={3} display={'flex'} alignItems={'flex-start'} justifyContent={'center'}>
                <FormControl>
                    <RadioGroup
                        row
                    >
                        {product?.options?.map(((option: any) => {
                            return Object.keys(option).map(key => option[key]?.map((item: any) => <FormControlLabel key={item} value={item} control={<Radio />} label={item} />))
                        }))}
                    </RadioGroup>
                </FormControl>
            </Box>}


            {actionComponent}
            <Button
                aria-expanded={expanded}
                aria-label="show more"
                color="primary"
                fullWidth
                onClick={() => setExpanded(!expanded)}
                size="large"
            >
                <Box alignItems="center" color="text.primary" fontSize="14px">
                    <Box alignItems="center" display={'flex'}>
                        <Typography component="span">Chi tiết</Typography>
                        <ExpandMore
                            color="primary"
                            name="chevron-down"
                            style={expanded ? expandOpen : expand}
                        />
                    </Box>
                </Box>
            </Button>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box alignItems="stretch" >
                    {product.description}
                </Box>
            </Collapse>
        </InsetSpacing>
    </Card >
    )
}


export default ProductItem