-- Manna Restaurant Seed Data

-- Clear existing data (optional, use with caution)
DELETE FROM menu_items;
DELETE FROM dining_tables;

-- Seed Menu Items
INSERT INTO menu_items (id, name_en, name_sw, desc_en, desc_sw, price, category, is_available) VALUES
('m1', 'Chips Mayai Special', 'Chips Mayai Maarufu', 'Classic French fries omelette, served with kachumbari salad and homemade chili.', 'Chips safi zilizokaangwa na mayai mawili, pamoja na kachumbari na pilipili ya nyumbani.', 4500, 'specials', 1),
('m2', 'Nyama Choma Platters', 'Plata ya Nyama Choma tetema', 'Premium tender beef local cut, grilled slowly on charcoal, served with kachumbari and ugali.', 'Nyama ya ng''ombe laini choma ya mkaa upishi polepole, na kachumbari na ugali.', 12000, 'food', 1),
('m3', 'Pilau Kuku ya Arusha', 'Pilau la Kuku la Arusha', 'Fragrant Tanzanian spiced rice cooked cooked with ginger, garlic, and locally sourced chicken.', 'Pilau yenye viungo vizuri vya Arusha iliyopikwa kwa tangawizi, vitunguu saumu na kuku wa kienyeji.', 8500, 'specials', 1),
('m4', 'Ugali na Naazi Samaki', 'Ugali na Samaki wa Nazi', 'Tanzanian white maize meal served with deep fried tilapia topped with rich sweet coconut curry sauce.', 'Ugali safi wa mahindi meupe uliosindikizwa na tilapia kukaangwa na mchuzi mtamu wa nazi.', 11000, 'food', 1),
('m5', 'Samosa za Nyama (2pcs)', 'Sambusa za Nyama (Mbili)', 'Crispy beef pastries seasoned with Tanzanian cardamom and sweet onions.', 'Sambusa mbili za nyama zenye viungo safi na vitunguu, zimekaangwa zikawa na ubaridi mtamu.', 2000, 'sides', 1),
('m6', 'Mchapati Mtamu wa Siagi', 'Chapati ya Mafuta na Siagi', 'Soft layered East African pan-fried flatbread, perfect with tea or direct meals.', 'Chapati laini ya tabaka za siagi kwa mlo au kunywea chai asubuhi au jioni.', 1500, 'sides', 1),
('m7', 'Safari Lager', 'Bia ya Safari', 'Famous crisp Tanzanian lager representing regional taste of active adventure.', 'Bia maarufu yenye ladha nzuri na baridi, kiburudisho tosha cha Kitalii.', 4000, 'drink', 1),
('m8', 'Milk Tea with Cardamom', 'Chai ya Maziwa ya Iliki', 'Aromatic black tea leaves brewed with fresh cow milk and organic iliki.', 'Chai tamu ya maziwa iliyochemshwa na majani ya chai ya kienyeji na iliki safi ya Arusha.', 1500, 'drink', 1),
('m9', 'Kilimanjaro Pure Water 1L', 'Maji ya Kilimanjaro 1L', 'Clean natural mineral water bottled directly at Mount Kilimanjaro.', 'Maji safi ya asili na baridi yaliyochujwa tangu mlima Kilimanjaro.', 1500, 'drink', 1);

-- Seed Tables
INSERT INTO dining_tables (id, table_number, status) VALUES
('1', 'T1 (Kona)', 'empty'),
('2', 'T2 (Mlangoni)', 'empty'),
('3', 'T3 (VIP Up)', 'empty'),
('4', 'T4 (Kikao)', 'empty'),
('5', 'T5 (Bustani)', 'empty'),
('6', 'T6 (Bar Counter)', 'empty');
