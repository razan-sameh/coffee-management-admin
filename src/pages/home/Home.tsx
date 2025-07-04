import { Grid, Stack } from "@mui/material";
import HeroBanner from "./component/HeroBanner";
import ProductGrid from "./component/ProductGrid";
import TopBar from "./component/TopBar";
import { useEffect, useState } from 'react';
import CheckoutStepper from "./component/CartSummary";
import PromoCard from "./component/PromoCard";
import promo from '../../assets/images/Rectangle 11.png'
import type { typCategory, typProduct } from "../../content/types";
import { getAllCategories, getAllProducts } from "../../database/select";

export default function Home() {
  const [products, setProducts] = useState<typProduct[]>([]);
  const [categories, setCategories] = useState<Record<string, typCategory>>({});
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');

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
        <Grid size={8}>
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
        <Grid size={4}>
          <Stack spacing={2}>
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
