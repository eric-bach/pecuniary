
import { Box, Divider, Grid, Typography } from '@material-ui/core'
import { InsetSpacing } from 'components/Spacing'
import { Product as OrderProduct } from 'openapi';
import React, { ReactElement } from 'react'
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from 'services/redux/rootReducer';

export type CartItemProps = {
    product: OrderProduct
}
function formatCurrency(num: number) {
    return num?.toLocaleString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}

const CartItem = (props: CartItemProps) => {
    const { product } = props
    return <Box
        style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
        }}>
        <img
            alt={product.thumbnail_url}
            src={product.thumbnail_url}
            height="96px"
            style={{ objectFit: 'contain' }}
            width="96px"
        />
        <Box style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
        }}>
            <Box textAlign={'end'}>
                <Typography
                    color="textPrimary"
                    display="block"
                    style={{ fontWeight: 'bold' }}
                >
                    1 x {product.name}
                </Typography>
                {product?.options?.map(() => {
                    <Typography
                    color="textPrimary"
                    display="block"
                >
                    Size: XL
                </Typography>
                })}
            </Box>
            <Box textAlign={'end'}>
                <Typography color="textSecondary" display='inline' >
                    Thành tiền:&nbsp;
                </Typography>
                <Typography color="textPrimary"
                    display='inline'>
                    {formatCurrency(product.price)}
                    VND
                </Typography>
            </Box>
        </Box>
    </Box>
}


export const ShoppingCart = (
): ReactElement => {
    const { selectedProducts } = useSelector((state: RootState) => state.ProductSelection, shallowEqual);

    return <InsetSpacing scale={3}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant='h6'>
                    Giỏ hàng của bạn
                </Typography>
            </Grid>
            {selectedProducts.map(selectedProduct => {
                return <Grid key={selectedProduct.id} item xs={12}>
                    <Grid container direction="row" spacing={2}>
                        <Grid
                            alignContent="flex-end"
                            alignItems="flex-end"
                            item
                            xs={12}
                        >
                            <CartItem product={selectedProduct} />
                        </Grid>

                    </Grid>
                </Grid>
            })}
                        
            <Grid item xs={12} >
                <Divider />
            </Grid>

            <Grid item xs={12}>
                <Typography color="textSecondary" display='inline' variant="h6">
                    Tổng cộng:&nbsp;
                </Typography>
                <Typography color="textPrimary"
                    style={{ fontWeight: 'bold' }} display='inline' variant="h6">
                    {formatCurrency(selectedProducts.map(item => item.price).reduce((prev, curr) => prev + curr, 0))} VND
                </Typography>
            </Grid>

        </Grid>
    </InsetSpacing>
}