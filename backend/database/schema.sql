--
-- Table structure for table `background_images`
--

DROP TABLE IF EXISTS `background_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `background_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `original_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `background_images`
--

LOCK TABLES `background_images` WRITE;
/*!40000 ALTER TABLE `background_images` DISABLE KEYS */;
INSERT INTO `background_images` VALUES (3,'bg_1768299972171_967176510.png','644457.png','/uploads/backgrounds/bg_1768299972171_967176510.png','2026-01-13 10:26:12'),(4,'bg_1768302054921_108401430.png','1000069762.png','/uploads/backgrounds/bg_1768302054921_108401430.png','2026-01-13 11:00:55'),(6,'bg_1768382360931_423313782.webp','1000068450.webp','/uploads/backgrounds/bg_1768382360931_423313782.webp','2026-01-14 09:19:20');
/*!40000 ALTER TABLE `background_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `note_date` date NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_note_date` (`note_date`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
/*!40000 ALTER TABLE `notes` DISABLE KEYS */;
INSERT INTO `notes` VALUES (11,'2026-01-14','test sport','2026-01-13 23:18:54','2026-01-14 08:50:47');
/*!40000 ALTER TABLE `notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `id` int NOT NULL,
  `weekA_color` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#2D6CDF',
  `weekB_color` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#F59E0B',
  `background_type` enum('gradient','image') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'gradient',
  `background_value` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'linear-gradient(135deg, #0f172a, #111827)',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
INSERT INTO `settings` VALUES (1,'#60A5FA','#F472B6','image','/uploads/backgrounds/bg_1768382360931_423313782.webp','2026-01-14 09:25:26');
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

