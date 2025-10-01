import { Card, CardContent, Typography, Grid, ButtonBase } from "@mui/material";
import { getTopSellingProducts } from "../../../content/utils";
import { useDashboardData } from "../../../hook/useDashboardData";
import { useNavigate } from "react-router";

const TopSellingProducts = () => {
  const navigate = useNavigate();
  const { orders, products, loading } = useDashboardData();

  if (loading) return <p>Loading...</p>;
  if (!orders.length || !products.length) return <p>No data available</p>;

  const topProducts = getTopSellingProducts(orders, products);
  if (!topProducts.length) return <p>No top products found</p>;

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h6" mb={2}>
          Top Selling Products
        </Typography>
        <Grid container spacing={2}>
          {topProducts.map((product) => (
            <Grid size={{ xs: 6, sm: 4, md: 2 }} key={product.ID}>
              <ButtonBase
                onClick={() => navigate(`/product/${product.ID}`)}
                sx={{
                  p: 2,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  borderRadius: 2,
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                {product.image[0] && (
                  <img
                    src={product.image[0]}
                    alt={product.title}
                    style={{
                      borderRadius: 50,
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      margin: "0 auto",
                    }}
                  />
                )}
                <Typography mt={1}>{product.title}</Typography>
              </ButtonBase>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TopSellingProducts;
