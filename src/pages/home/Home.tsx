import { Grid, Stack, useMediaQuery, useTheme } from "@mui/material";
import HeroBanner from "./component/HeroBanner";
import ProductGrid from "./component/ProductGrid";
import TopBar from "./component/TopBar";
import { useEffect, useState } from 'react';
import CheckoutStepper from "./component/cartSummary/CartSummary";
import PromoCard from "./component/PromoCard";
import promo from '../../assets/images/Rectangle 11.png'
import type { typCategory, typProduct } from "../../content/types";
import { getAllCategories, getAllProducts } from "../../database/select";

export default function Home() {
  const [products, setProducts] = useState<typProduct[]>([]);
  const [categories, setCategories] = useState<Record<string, typCategory>>({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const unsubscribeProducts = getAllProducts((data) => {
      const productList = Object.entries(data).map(([id, item]) => ({
        ...item,
        ID: id, // in case Firebase doesn't give ID
      }));
      setProducts(productList);
    });

    const unsubscribeCategories = getAllCategories((data) => {
      setCategories(data);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeCategories();
    };
  }, []);

  const filtered = products
    .filter(
      (p) =>
        (selectedCategory === '' ||
          String(p.category) === selectedCategory) &&
        p.title.toLowerCase().includes(search.toLowerCase())
    )
    .map((p) => ({
      ...p,
      categoryTitle: categories[p.category]?.title || 'Unknown',
    }));

  return (
    <>
      <Grid container spacing={2}>
        {/* Main Content */}
        <Grid 
          size={{ xs: 12, md: 8 }} 
          order={{ xs: 2, md: 1 }}
        >
          <Stack spacing={2}>
            <HeroBanner />
            <TopBar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              search={search}
              setSearch={setSearch}
              categories={Object.values(categories)}
            />
            <ProductGrid products={filtered} />
          </Stack>
        </Grid>
        
        {/* Sidebar */}
        <Grid 
          size={{ xs: 12, md: 4 }}
          order={{ xs: 1, md: 2 }}
        >
          <Stack 
            spacing={2}
            direction={"column"}
            sx={isMobile ? { 
              overflowX: 'auto',
              pb: 1,
              '& > *': { 
                minWidth: 280,
                flex: '0 0 auto'
              }
            } : {}}
          >
            <PromoCard
              title="25% OFF!"
              description="All coffee orders today only"
              image={promo}
            />
            <CheckoutStepper />
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}