-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-06-2026 a las 19:04:54
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `mediflow_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `centros_salud`
--

CREATE TABLE `centros_salud` (
  `id_centro_salud` bigint(20) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `telefono` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `citas`
--

CREATE TABLE `citas` (
  `id` bigint(20) NOT NULL,
  `estado_cita` enum('AGENDADA','ASISTIDA','CANCELADA','CONFIRMADA','FINALIZADA','NO_ASISTIDA') NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `observaciones` varchar(255) DEFAULT NULL,
  `id_especialidad` bigint(20) NOT NULL,
  `profesional_id` bigint(20) DEFAULT NULL,
  `usuario_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `citas`
--

INSERT INTO `citas` (`id`, `estado_cita`, `fecha`, `hora`, `motivo`, `observaciones`, `id_especialidad`, `profesional_id`, `usuario_id`) VALUES
(1, 'CANCELADA', '2026-06-26', '10:00:00', 'Dolor de espalda', '', 1, 1, 3),
(2, 'FINALIZADA', '2026-06-22', '10:00:00', 'Agendada desde chatbot', 'Cita creada automáticamente por el asistente', 1, 1, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comunas`
--

CREATE TABLE `comunas` (
  `id` bigint(20) NOT NULL,
  `activo` bit(1) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `region_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `comunas`
--

INSERT INTO `comunas` (`id`, `activo`, `nombre`, `region_id`) VALUES
(1, b'1', 'Arica', 1),
(2, b'1', 'Camarones', 1),
(3, b'1', 'General Lagos', 1),
(4, b'1', 'Putre', 1),
(5, b'1', 'Alto Hospicio', 2),
(6, b'1', 'Camina', 2),
(7, b'1', 'Colchane', 2),
(8, b'1', 'Huara', 2),
(9, b'1', 'Iquique', 2),
(10, b'1', 'Pica', 2),
(11, b'1', 'Pozo Almonte', 2),
(12, b'1', 'Antofagasta', 3),
(13, b'1', 'Calama', 3),
(14, b'1', 'Maria Elena', 3),
(15, b'1', 'Mejillones', 3),
(16, b'1', 'Olague', 3),
(17, b'1', 'San Pedro de Atacama', 3),
(18, b'1', 'Sierra Gorda', 3),
(19, b'1', 'Taltal', 3),
(20, b'1', 'Tocopilla', 3),
(21, b'1', 'Alto del Carmen', 4),
(22, b'1', 'Caldera', 4),
(23, b'1', 'Chanaral', 4),
(24, b'1', 'Copiapo', 4),
(25, b'1', 'Diego de Almagro', 4),
(26, b'1', 'Freirina', 4),
(27, b'1', 'Huasco', 4),
(28, b'1', 'Tierra Amarilla', 4),
(29, b'1', 'Vallenar', 4),
(30, b'1', 'Andacollo', 5),
(31, b'1', 'Canela', 5),
(32, b'1', 'Combarbala', 5),
(33, b'1', 'Coquimbo', 5),
(34, b'1', 'Illapel', 5),
(35, b'1', 'La Higuera', 5),
(36, b'1', 'La Serena', 5),
(37, b'1', 'Los Vilos', 5),
(38, b'1', 'Monte Patria', 5),
(39, b'1', 'Ovalle', 5),
(40, b'1', 'Paihuano', 5),
(41, b'1', 'Punitaqui', 5),
(42, b'1', 'Rio Hurtado', 5),
(43, b'1', 'Salamanca', 5),
(44, b'1', 'Vicuna', 5),
(45, b'1', 'Algarrobo', 6),
(46, b'1', 'Cabildo', 6),
(47, b'1', 'Calera', 6),
(48, b'1', 'Calle Larga', 6),
(49, b'1', 'Cartagena', 6),
(50, b'1', 'Casablanca', 6),
(51, b'1', 'Catemu', 6),
(52, b'1', 'Concon', 6),
(53, b'1', 'El Quisco', 6),
(54, b'1', 'El Tabo', 6),
(55, b'1', 'Hijuelas', 6),
(56, b'1', 'Isla de Pascua', 6),
(57, b'1', 'Juan Fernandez', 6),
(58, b'1', 'La Cruz', 6),
(59, b'1', 'La Ligua', 6),
(60, b'1', 'Limache', 6),
(61, b'1', 'Llaillay', 6),
(62, b'1', 'Los Andes', 6),
(63, b'1', 'Nogales', 6),
(64, b'1', 'Olmue', 6),
(65, b'1', 'Panquehue', 6),
(66, b'1', 'Papudo', 6),
(67, b'1', 'Petorca', 6),
(68, b'1', 'Puchuncavi', 6),
(69, b'1', 'Putaendo', 6),
(70, b'1', 'Quillota', 6),
(71, b'1', 'Quilpue', 6),
(72, b'1', 'Quintero', 6),
(73, b'1', 'Rinconada', 6),
(74, b'1', 'San Antonio', 6),
(75, b'1', 'San Esteban', 6),
(76, b'1', 'San Felipe', 6),
(77, b'1', 'Santa Maria', 6),
(78, b'1', 'Santo Domingo', 6),
(79, b'1', 'Valparaiso', 6),
(80, b'1', 'Villa Alemana', 6),
(81, b'1', 'Vina del Mar', 6),
(82, b'1', 'Zapallar', 6),
(83, b'1', 'Alhue', 7),
(84, b'1', 'Buin', 7),
(85, b'1', 'Calera de Tango', 7),
(86, b'1', 'Cerrillos', 7),
(87, b'1', 'Cerro Navia', 7),
(88, b'1', 'Colina', 7),
(89, b'1', 'Conchali', 7),
(90, b'1', 'Curacavi', 7),
(91, b'1', 'El Bosque', 7),
(92, b'1', 'El Monte', 7),
(93, b'1', 'Estacion Central', 7),
(94, b'1', 'Huechuraba', 7),
(95, b'1', 'Independencia', 7),
(96, b'1', 'Isla de Maipo', 7),
(97, b'1', 'La Cisterna', 7),
(98, b'1', 'La Florida', 7),
(99, b'1', 'La Granja', 7),
(100, b'1', 'La Pintana', 7),
(101, b'1', 'La Reina', 7),
(102, b'1', 'Lampa', 7),
(103, b'1', 'Las Condes', 7),
(104, b'1', 'Lo Barnechea', 7),
(105, b'1', 'Lo Espejo', 7),
(106, b'1', 'Lo Prado', 7),
(107, b'1', 'Macul', 7),
(108, b'1', 'Maipu', 7),
(109, b'1', 'Maria Pinto', 7),
(110, b'1', 'Melipilla', 7),
(111, b'1', 'Nunoa', 7),
(112, b'1', 'Padre Hurtado', 7),
(113, b'1', 'Paine', 7),
(114, b'1', 'Pedro Aguirre Cerda', 7),
(115, b'1', 'Penalolen', 7),
(116, b'1', 'Penaflor', 7),
(117, b'1', 'Pirque', 7),
(118, b'1', 'Providencia', 7),
(119, b'1', 'Pudahuel', 7),
(120, b'1', 'Puente Alto', 7),
(121, b'1', 'Quilicura', 7),
(122, b'1', 'Quinta Normal', 7),
(123, b'1', 'Recoleta', 7),
(124, b'1', 'Renca', 7),
(125, b'1', 'San Bernardo', 7),
(126, b'1', 'San Joaquin', 7),
(127, b'1', 'San Jose de Maipo', 7),
(128, b'1', 'San Miguel', 7),
(129, b'1', 'San Pedro', 7),
(130, b'1', 'San Ramon', 7),
(131, b'1', 'Santiago', 7),
(132, b'1', 'Talagante', 7),
(133, b'1', 'Tiltil', 7),
(134, b'1', 'Vitacura', 7),
(135, b'1', 'Chimbarongo', 8),
(136, b'1', 'Chepica', 8),
(137, b'1', 'Codegua', 8),
(138, b'1', 'Coinco', 8),
(139, b'1', 'Coltauco', 8),
(140, b'1', 'Donihue', 8),
(141, b'1', 'Graneros', 8),
(142, b'1', 'La Estrella', 8),
(143, b'1', 'Las Cabras', 8),
(144, b'1', 'Litueche', 8),
(145, b'1', 'Lolol', 8),
(146, b'1', 'Machali', 8),
(147, b'1', 'Malloa', 8),
(148, b'1', 'Marchigue', 8),
(149, b'1', 'Mostazal', 8),
(150, b'1', 'Nancagua', 8),
(151, b'1', 'Navidad', 8),
(152, b'1', 'Olivar', 8),
(153, b'1', 'Palmilla', 8),
(154, b'1', 'Paredones', 8),
(155, b'1', 'Peralillo', 8),
(156, b'1', 'Peumo', 8),
(157, b'1', 'Pichidegua', 8),
(158, b'1', 'Pichilemu', 8),
(159, b'1', 'Placilla', 8),
(160, b'1', 'Pumanque', 8),
(161, b'1', 'Quinta de Tilcoco', 8),
(162, b'1', 'Rancagua', 8),
(163, b'1', 'Rengo', 8),
(164, b'1', 'Requinoa', 8),
(165, b'1', 'San Fernando', 8),
(166, b'1', 'San Vicente', 8),
(167, b'1', 'Santa Cruz', 8),
(168, b'1', 'Cauquenes', 9),
(169, b'1', 'Chanco', 9),
(170, b'1', 'Colbun', 9),
(171, b'1', 'Constitucion', 9),
(172, b'1', 'Curepto', 9),
(173, b'1', 'Curico', 9),
(174, b'1', 'Empedrado', 9),
(175, b'1', 'Hualane', 9),
(176, b'1', 'Licanten', 9),
(177, b'1', 'Linares', 9),
(178, b'1', 'Longavi', 9),
(179, b'1', 'Maule', 9),
(180, b'1', 'Molina', 9),
(181, b'1', 'Parral', 9),
(182, b'1', 'Pelarco', 9),
(183, b'1', 'Pelluhue', 9),
(184, b'1', 'Pencahue', 9),
(185, b'1', 'Rauco', 9),
(186, b'1', 'Retiro', 9),
(187, b'1', 'Rio Claro', 9),
(188, b'1', 'Romeral', 9),
(189, b'1', 'Sagrada Familia', 9),
(190, b'1', 'San Clemente', 9),
(191, b'1', 'San Javier', 9),
(192, b'1', 'San Rafael', 9),
(193, b'1', 'Talca', 9),
(194, b'1', 'Teno', 9),
(195, b'1', 'Vichuquen', 9),
(196, b'1', 'Villa Alegre', 9),
(197, b'1', 'Yerbas Buenas', 9),
(198, b'1', 'Bulnes', 10),
(199, b'1', 'Chillan', 10),
(200, b'1', 'Chillan Viejo', 10),
(201, b'1', 'Cobquecura', 10),
(202, b'1', 'Coelemu', 10),
(203, b'1', 'Coihueco', 10),
(204, b'1', 'El Carmen', 10),
(205, b'1', 'Ninhue', 10),
(206, b'1', 'Niquen', 10),
(207, b'1', 'Pemuco', 10),
(208, b'1', 'Pinto', 10),
(209, b'1', 'Portezuelo', 10),
(210, b'1', 'Quillon', 10),
(211, b'1', 'Quirihue', 10),
(212, b'1', 'Ranquil', 10),
(213, b'1', 'San Carlos', 10),
(214, b'1', 'San Fabian', 10),
(215, b'1', 'San Ignacio', 10),
(216, b'1', 'San Nicolas', 10),
(217, b'1', 'Treguaco', 10),
(218, b'1', 'Yungay', 10),
(219, b'1', 'Alto Biobio', 11),
(220, b'1', 'Antuco', 11),
(221, b'1', 'Arauco', 11),
(222, b'1', 'Cabrero', 11),
(223, b'1', 'Canete', 11),
(224, b'1', 'Chiguayante', 11),
(225, b'1', 'Concepcion', 11),
(226, b'1', 'Contulmo', 11),
(227, b'1', 'Coronel', 11),
(228, b'1', 'Curanilahue', 11),
(229, b'1', 'Florida', 11),
(230, b'1', 'Hualpen', 11),
(231, b'1', 'Hualqui', 11),
(232, b'1', 'Laja', 11),
(233, b'1', 'Lebu', 11),
(234, b'1', 'Los Alamos', 11),
(235, b'1', 'Los Angeles', 11),
(236, b'1', 'Lota', 11),
(237, b'1', 'Mulchen', 11),
(238, b'1', 'Nacimiento', 11),
(239, b'1', 'Negrete', 11),
(240, b'1', 'Penco', 11),
(241, b'1', 'Quilaco', 11),
(242, b'1', 'Quilleco', 11),
(243, b'1', 'San Pedro de la Paz', 11),
(244, b'1', 'San Rosendo', 11),
(245, b'1', 'Santa Barbara', 11),
(246, b'1', 'Santa Juana', 11),
(247, b'1', 'Talcahuano', 11),
(248, b'1', 'Tirua', 11),
(249, b'1', 'Tome', 11),
(250, b'1', 'Tucapel', 11),
(251, b'1', 'Yumbel', 11),
(252, b'1', 'Angol', 12),
(253, b'1', 'Carahue', 12),
(254, b'1', 'Cholchol', 12),
(255, b'1', 'Collipulli', 12),
(256, b'1', 'Cunco', 12),
(257, b'1', 'Curacautin', 12),
(258, b'1', 'Curarrehue', 12),
(259, b'1', 'Ercilla', 12),
(260, b'1', 'Freire', 12),
(261, b'1', 'Galvarino', 12),
(262, b'1', 'Gorbea', 12),
(263, b'1', 'Lautaro', 12),
(264, b'1', 'Loncoche', 12),
(265, b'1', 'Lonquimay', 12),
(266, b'1', 'Los Sauces', 12),
(267, b'1', 'Lumaco', 12),
(268, b'1', 'Melipeuco', 12),
(269, b'1', 'Nueva Imperial', 12),
(270, b'1', 'Padre Las Casas', 12),
(271, b'1', 'Perquenco', 12),
(272, b'1', 'Pitrufquen', 12),
(273, b'1', 'Pucon', 12),
(274, b'1', 'Puren', 12),
(275, b'1', 'Renaico', 12),
(276, b'1', 'Saavedra', 12),
(277, b'1', 'Temuco', 12),
(278, b'1', 'Teodoro Schmidt', 12),
(279, b'1', 'Tolten', 12),
(280, b'1', 'Traiguen', 12),
(281, b'1', 'Victoria', 12),
(282, b'1', 'Vilcun', 12),
(283, b'1', 'Villarrica', 12),
(284, b'1', 'Corral', 13),
(285, b'1', 'Futrono', 13),
(286, b'1', 'La Union', 13),
(287, b'1', 'Lago Ranco', 13),
(288, b'1', 'Lanco', 13),
(289, b'1', 'Los Lagos', 13),
(290, b'1', 'Mafil', 13),
(291, b'1', 'Mariquina', 13),
(292, b'1', 'Paillaco', 13),
(293, b'1', 'Panguipulli', 13),
(294, b'1', 'Rio Bueno', 13),
(295, b'1', 'Valdivia', 13),
(296, b'1', 'Ancud', 14),
(297, b'1', 'Calbuco', 14),
(298, b'1', 'Castro', 14),
(299, b'1', 'Chaiten', 14),
(300, b'1', 'Chonchi', 14),
(301, b'1', 'Cochamo', 14),
(302, b'1', 'Curaco de Velez', 14),
(303, b'1', 'Dalcahue', 14),
(304, b'1', 'Fresia', 14),
(305, b'1', 'Frutillar', 14),
(306, b'1', 'Futaleufu', 14),
(307, b'1', 'Hualaihue', 14),
(308, b'1', 'Llanquihue', 14),
(309, b'1', 'Los Muermos', 14),
(310, b'1', 'Maullin', 14),
(311, b'1', 'Osorno', 14),
(312, b'1', 'Palena', 14),
(313, b'1', 'Puerto Montt', 14),
(314, b'1', 'Puerto Octay', 14),
(315, b'1', 'Puerto Varas', 14),
(316, b'1', 'Puqueldon', 14),
(317, b'1', 'Purranque', 14),
(318, b'1', 'Puyehue', 14),
(319, b'1', 'Queilen', 14),
(320, b'1', 'Quellon', 14),
(321, b'1', 'Quemchi', 14),
(322, b'1', 'Quinchao', 14),
(323, b'1', 'Rio Negro', 14),
(324, b'1', 'San Juan de la Costa', 14),
(325, b'1', 'San Pablo', 14),
(326, b'1', 'Aysen', 15),
(327, b'1', 'Chile Chico', 15),
(328, b'1', 'Cisnes', 15),
(329, b'1', 'Cochrane', 15),
(330, b'1', 'Coyhaique', 15),
(331, b'1', 'Guaitecas', 15),
(332, b'1', 'Lago Verde', 15),
(333, b'1', 'O\'Higgins', 15),
(334, b'1', 'Rio Ibanez', 15),
(335, b'1', 'Tortel', 15),
(336, b'1', 'Antartica', 16),
(337, b'1', 'Cabo de Hornos', 16),
(338, b'1', 'Laguna Blanca', 16),
(339, b'1', 'Natales', 16),
(340, b'1', 'Porvenir', 16),
(341, b'1', 'Primavera', 16),
(342, b'1', 'Punta Arenas', 16),
(343, b'1', 'Rio Verde', 16),
(344, b'1', 'San Gregorio', 16),
(345, b'1', 'Timaukel', 16),
(346, b'1', 'Torres del Paine', 16);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipos_medicos`
--

CREATE TABLE `equipos_medicos` (
  `id_equipos` bigint(20) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `equipo_profesional_id` bigint(20) NOT NULL,
  `servicio_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipos_profesionales`
--

CREATE TABLE `equipos_profesionales` (
  `id_equipo_profesional` bigint(20) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `equipo_medico_id` bigint(20) DEFAULT NULL,
  `servicio_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidades`
--

CREATE TABLE `especialidades` (
  `id` bigint(20) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `especialidades`
--

INSERT INTO `especialidades` (`id`, `descripcion`, `nombre`) VALUES
(1, '', 'Kinesiólogo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_clinico`
--

CREATE TABLE `historial_clinico` (
  `id` bigint(20) NOT NULL,
  `diagnostico` text DEFAULT NULL,
  `fecha` datetime(6) DEFAULT NULL,
  `fecha_registro` datetime(6) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `tratamiento` text DEFAULT NULL,
  `cita_id` bigint(20) DEFAULT NULL,
  `paciente_id` bigint(20) DEFAULT NULL,
  `profesional_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `historial_clinico`
--

INSERT INTO `historial_clinico` (`id`, `diagnostico`, `fecha`, `fecha_registro`, `observaciones`, `tratamiento`, `cita_id`, `paciente_id`, `profesional_id`) VALUES
(1, 'Dolor cronico', '2026-06-22 15:24:57.000000', '2026-06-22 15:24:57.000000', 'Consultar en caso de sos', 'Reposo', 2, 3, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id` bigint(20) NOT NULL,
  `observacion` varchar(255) DEFAULT NULL,
  `prevision` varchar(255) DEFAULT NULL,
  `usuario_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesionales_salud`
--

CREATE TABLE `profesionales_salud` (
  `id` bigint(20) NOT NULL,
  `disponible` bit(1) DEFAULT NULL,
  `hora_fin` time DEFAULT NULL,
  `hora_inicio` time DEFAULT NULL,
  `numero_registro` varchar(255) DEFAULT NULL,
  `especialidad_id` bigint(20) NOT NULL,
  `usuario_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `profesionales_salud`
--

INSERT INTO `profesionales_salud` (`id`, `disponible`, `hora_fin`, `hora_inicio`, `numero_registro`, `especialidad_id`, `usuario_id`) VALUES
(1, b'1', '17:00:00', '08:00:00', '1212212', 1, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesional_servicio`
--

CREATE TABLE `profesional_servicio` (
  `id` bigint(20) NOT NULL,
  `activo` bit(1) DEFAULT NULL,
  `duracion` varchar(255) NOT NULL,
  `fecha_creacion` date NOT NULL,
  `precio` varchar(255) NOT NULL,
  `profesional_salud_id` bigint(20) NOT NULL,
  `servicio_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `regiones`
--

CREATE TABLE `regiones` (
  `id` bigint(20) NOT NULL,
  `activo` bit(1) NOT NULL,
  `codigo` varchar(10) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `regiones`
--

INSERT INTO `regiones` (`id`, `activo`, `codigo`, `nombre`) VALUES
(1, b'1', '01', 'Arica y Parinacota'),
(2, b'1', '02', 'Tarapaca'),
(3, b'1', '03', 'Antofagasta'),
(4, b'1', '04', 'Atacama'),
(5, b'1', '05', 'Coquimbo'),
(6, b'1', '06', 'Valparaiso'),
(7, b'1', '07', 'Metropolitana'),
(8, b'1', '08', 'O\'Higgins'),
(9, b'1', '09', 'Maule'),
(10, b'1', '10', 'Nuble'),
(11, b'1', '11', 'Biobio'),
(12, b'1', '12', 'Araucania'),
(13, b'1', '13', 'Los Rios'),
(14, b'1', '14', 'Los Lagos'),
(15, b'1', '15', 'Aysen'),
(16, b'1', '16', 'Magallanes');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicios`
--

CREATE TABLE `servicios` (
  `id` bigint(20) NOT NULL,
  `activo` bit(1) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `duracion_minutos` int(11) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `centro_salud_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `teleconsultas`
--

CREATE TABLE `teleconsultas` (
  `id` bigint(20) NOT NULL,
  `fecha_ini` datetime(6) NOT NULL,
  `fecha_termino` datetime(6) DEFAULT NULL,
  `cita_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` bigint(20) NOT NULL,
  `activo` bit(1) DEFAULT NULL,
  `apellidos` varchar(50) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `debe_cambiar_password` bit(1) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `fecha_registro` datetime(6) NOT NULL,
  `nombres` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('ADMIN','PACIENTE','PROFESIONAL') NOT NULL,
  `run` varchar(12) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `comuna_id` bigint(20) DEFAULT NULL,
  `region_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `activo`, `apellidos`, `correo`, `debe_cambiar_password`, `direccion`, `fecha_registro`, `nombres`, `password`, `rol`, `run`, `telefono`, `comuna_id`, `region_id`) VALUES
(1, b'1', 'MediFlow', 'admin@mediflow.cl', b'0', NULL, '2026-06-22 15:17:37.000000', 'Admin', 'admin123', 'ADMIN', NULL, NULL, NULL, NULL),
(2, b'1', 'Esparza', 'seba@gmail.com', b'0', NULL, '2026-06-22 15:20:34.000000', 'Sebastián', '12345', 'PROFESIONAL', NULL, NULL, NULL, NULL),
(3, b'1', 'Zamorano', 'juan@gmail.com', b'0', 'casa 123', '2026-06-22 15:21:20.000000', 'Juan', '1234', 'PACIENTE', '190373460', '+56978075527', 91, 7);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `centros_salud`
--
ALTER TABLE `centros_salud`
  ADD PRIMARY KEY (`id_centro_salud`);

--
-- Indices de la tabla `citas`
--
ALTER TABLE `citas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKe7fxtlc0va6jojbxtsp06aglx` (`id_especialidad`),
  ADD KEY `FKrhofjwt6e3r50l6t9sn7l6eig` (`profesional_id`),
  ADD KEY `FK885bv099qj7bwu833i0d3jagt` (`usuario_id`);

--
-- Indices de la tabla `comunas`
--
ALTER TABLE `comunas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKnjk4795gca9myu88sli0ojkg1` (`region_id`);

--
-- Indices de la tabla `equipos_medicos`
--
ALTER TABLE `equipos_medicos`
  ADD PRIMARY KEY (`id_equipos`),
  ADD KEY `FK965wlch5c2p0divo636d0eb65` (`equipo_profesional_id`),
  ADD KEY `FKecxkrlmjo8hs7h5lf10oenbap` (`servicio_id`);

--
-- Indices de la tabla `equipos_profesionales`
--
ALTER TABLE `equipos_profesionales`
  ADD PRIMARY KEY (`id_equipo_profesional`),
  ADD KEY `FKnd3t6gd0upf4mxwokdjvg04md` (`equipo_medico_id`),
  ADD KEY `FKfqp84xmrg9hbdvnr0c78esk7g` (`servicio_id`);

--
-- Indices de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKkq918o2plf4a6b25osvl96dj7` (`nombre`);

--
-- Indices de la tabla `historial_clinico`
--
ALTER TABLE `historial_clinico`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK7uv7mtsuufexfgesxvg1fsk18` (`cita_id`),
  ADD KEY `FKh63qxo52nbqgoc32jtetr9yvu` (`paciente_id`),
  ADD KEY `FKmrutvx552v8tlriaemg9q5b0i` (`profesional_id`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK8djq3l2bga12won1nr4uhovlo` (`usuario_id`);

--
-- Indices de la tabla `profesionales_salud`
--
ALTER TABLE `profesionales_salud`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKb7eamw4g23nceodyfhar61utm` (`usuario_id`),
  ADD KEY `FKr2gdawix12sshmst47g8rroqw` (`especialidad_id`);

--
-- Indices de la tabla `profesional_servicio`
--
ALTER TABLE `profesional_servicio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKjiju9avjydntcljox38anw396` (`profesional_salud_id`),
  ADD KEY `FKrlp0hgbqrrgwphj2q6354hqnv` (`servicio_id`);

--
-- Indices de la tabla `regiones`
--
ALTER TABLE `regiones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK2utq0pi16tcaxyu29eqyk3olp` (`nombre`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK9fmxv2pydbke043b1kiux35m8` (`centro_salud_id`);

--
-- Indices de la tabla `teleconsultas`
--
ALTER TABLE `teleconsultas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKswq7k79fcbilewy68tdemnl9p` (`cita_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKcdmw5hxlfj78uf4997i3qyyw5` (`correo`),
  ADD UNIQUE KEY `UKksyidfr5g3rl0b04glr24fxjn` (`run`),
  ADD KEY `FKjhmg5qollnio1ki5a0lbewrrf` (`comuna_id`),
  ADD KEY `FKpge15oc1vesms1wlrilcujtcm` (`region_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `centros_salud`
--
ALTER TABLE `centros_salud`
  MODIFY `id_centro_salud` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `citas`
--
ALTER TABLE `citas`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `comunas`
--
ALTER TABLE `comunas`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=347;

--
-- AUTO_INCREMENT de la tabla `equipos_medicos`
--
ALTER TABLE `equipos_medicos`
  MODIFY `id_equipos` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `equipos_profesionales`
--
ALTER TABLE `equipos_profesionales`
  MODIFY `id_equipo_profesional` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `especialidades`
--
ALTER TABLE `especialidades`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `historial_clinico`
--
ALTER TABLE `historial_clinico`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `profesionales_salud`
--
ALTER TABLE `profesionales_salud`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `profesional_servicio`
--
ALTER TABLE `profesional_servicio`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `regiones`
--
ALTER TABLE `regiones`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `teleconsultas`
--
ALTER TABLE `teleconsultas`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `citas`
--
ALTER TABLE `citas`
  ADD CONSTRAINT `FK885bv099qj7bwu833i0d3jagt` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `FKe7fxtlc0va6jojbxtsp06aglx` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades` (`id`),
  ADD CONSTRAINT `FKrhofjwt6e3r50l6t9sn7l6eig` FOREIGN KEY (`profesional_id`) REFERENCES `profesionales_salud` (`id`);

--
-- Filtros para la tabla `comunas`
--
ALTER TABLE `comunas`
  ADD CONSTRAINT `FKnjk4795gca9myu88sli0ojkg1` FOREIGN KEY (`region_id`) REFERENCES `regiones` (`id`);

--
-- Filtros para la tabla `equipos_medicos`
--
ALTER TABLE `equipos_medicos`
  ADD CONSTRAINT `FK965wlch5c2p0divo636d0eb65` FOREIGN KEY (`equipo_profesional_id`) REFERENCES `equipos_profesionales` (`id_equipo_profesional`),
  ADD CONSTRAINT `FKecxkrlmjo8hs7h5lf10oenbap` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`);

--
-- Filtros para la tabla `equipos_profesionales`
--
ALTER TABLE `equipos_profesionales`
  ADD CONSTRAINT `FKfqp84xmrg9hbdvnr0c78esk7g` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`),
  ADD CONSTRAINT `FKnd3t6gd0upf4mxwokdjvg04md` FOREIGN KEY (`equipo_medico_id`) REFERENCES `equipos_medicos` (`id_equipos`);

--
-- Filtros para la tabla `historial_clinico`
--
ALTER TABLE `historial_clinico`
  ADD CONSTRAINT `FKh63qxo52nbqgoc32jtetr9yvu` FOREIGN KEY (`paciente_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `FKmrutvx552v8tlriaemg9q5b0i` FOREIGN KEY (`profesional_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `FKqsgfbnpj2fmtawdfnp7y808qu` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id`);

--
-- Filtros para la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD CONSTRAINT `FK96vvhaactwhv7l8ymuq6b4r6j` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `profesionales_salud`
--
ALTER TABLE `profesionales_salud`
  ADD CONSTRAINT `FKpn95dbhei8gosu9hu2pgadg2q` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `FKr2gdawix12sshmst47g8rroqw` FOREIGN KEY (`especialidad_id`) REFERENCES `especialidades` (`id`);

--
-- Filtros para la tabla `profesional_servicio`
--
ALTER TABLE `profesional_servicio`
  ADD CONSTRAINT `FKjiju9avjydntcljox38anw396` FOREIGN KEY (`profesional_salud_id`) REFERENCES `profesionales_salud` (`id`),
  ADD CONSTRAINT `FKrlp0hgbqrrgwphj2q6354hqnv` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`);

--
-- Filtros para la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD CONSTRAINT `FK9fmxv2pydbke043b1kiux35m8` FOREIGN KEY (`centro_salud_id`) REFERENCES `centros_salud` (`id_centro_salud`);

--
-- Filtros para la tabla `teleconsultas`
--
ALTER TABLE `teleconsultas`
  ADD CONSTRAINT `FKm2sfdr26sw56c145pxh11ulcs` FOREIGN KEY (`cita_id`) REFERENCES `citas` (`id`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `FKjhmg5qollnio1ki5a0lbewrrf` FOREIGN KEY (`comuna_id`) REFERENCES `comunas` (`id`),
  ADD CONSTRAINT `FKpge15oc1vesms1wlrilcujtcm` FOREIGN KEY (`region_id`) REFERENCES `regiones` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
