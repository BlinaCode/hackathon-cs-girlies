import React, { useState } from 'react';
import { BookOpen, CheckCircle, Clock, Search, X, Sparkles, Compass, Brain, Moon, Heart, ArrowRight } from 'lucide-react';
import { STARTER_RESOURCES } from '../services/resourcesData';
import { useWellness } from '../context/WellnessContext';
import { CountryCrisisLines } from './CountryCrisisLines';
import frascoSvg from '../assets/svg/frascoalgas.svg';

function FishIcon() {
  return (
    <svg viewBox="0 0 50 30" className="w-full h-full drop-shadow-sm" aria-hidden="true">
      <path d="M 8 15 C 8 8, 28 6, 36 15 C 28 24, 8 22, 8 15 Z" fill="#A4D3DE" stroke="#7AABB8" strokeWidth="1.5" />
      <path d="M 36 15 L 46 8 L 44 15 L 46 22 Z" fill="#A4D3DE" stroke="#7AABB8" strokeWidth="1.5" />
      <circle cx="15" cy="12" r="1.8" fill="#4A2511" />
      <path d="M 22 10 C 20 13, 20 17, 22 20" stroke="#7AABB8" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M 27 11 C 25 14, 25 16, 27 19" stroke="#7AABB8" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}


function SeaweedIcon() {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-sm" aria-hidden="true">
      <path d="M 12 38 C 6 28, 18 20, 12 10 C 8 4, 14 2, 14 2" stroke="#8BAE7B" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M 24 38 C 30 26, 18 18, 25 10 C 29 4, 24 2, 25 2" stroke="#A5C496" strokeWidth="4" strokeLinecap="round" fill="none" />
    </svg>
  );
}


function BalanceRocksIcon() {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-sm" aria-hidden="true">
      <ellipse cx="20" cy="32" rx="14" ry="5.5" fill="#788487" />
      <ellipse cx="19" cy="23" rx="10" ry="4.5" fill="#95A3A5" />
      <ellipse cx="21" cy="15" rx="6.5" ry="3.5" fill="#B3C0C2" />
    </svg>
  );
}


function SeashellIcon() {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-sm" aria-hidden="true">
      <path
        d="M 10 32 C 6 16, 34 16, 30 32 C 34 37, 6 37, 10 32 Z"
        fill="#F5B2B8"
        stroke="#E08B95"
        strokeWidth="1.2"
      />
      <path
        d="M 20 35 L 13 20"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M 20 35 L 20 17"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M 20 35 L 27 20"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}


function SandDollarIcon() {
  return (
    <svg
      viewBox="0 0 40 40"
      className="w-full h-full drop-shadow-sm"
      aria-hidden="true"
    >
      <circle
        cx="20"
        cy="20"
        r="16"
        fill="#F5E8C9"
        stroke="#E3CE9E"
        strokeWidth="1.5"
      />

      <g
        stroke="#D1B882"
        strokeWidth="1.2"
        fill="none"
        opacity="0.85"
        strokeLinecap="round"
      >
        <path d="M20 10 C21.5 15, 21.5 20, 20 25 M20 10 C18.5 15, 18.5 20, 20 25" />
        <path d="M10 20 C15 21.5, 20 21.5, 25 20 M10 20 C15 18.5, 20 18.5, 25 20" />
      </g>
    </svg>
  );
}


function SeaGlassIcon() {
  return (
    <svg
      viewBox="0 0 40 40"
      className="w-full h-full drop-shadow-sm"
      aria-hidden="true"
    >
      <path
        d="M 18 6 C 28 4, 35 14, 32 26 C 28 35, 14 36, 8 28 C 4 18, 10 8, 18 6 Z"
        fill="#CFE2F3"
        stroke="#A4D3DE"
        strokeWidth="1.5"
        opacity="0.9"
      />
      <path
        d="M 16 10 C 24 10, 28 16, 26 26"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}


function CoastalElementIcon() {
  return (
    <svg
      viewBox="0 0 40 40"
      className="w-full h-full drop-shadow-sm"
      aria-hidden="true"
    >
      <path
        d="M 20 36 L 20 6 M 20 12 L 30 6 M 20 18 L 32 12 M 20 24 L 30 18 M 20 12 L 10 6 M 20 18 L 8 12 M 20 24 L 10 18"
        stroke="#84A8A6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function ResourceHub({ setActiveTab }) {

  const {
    completedResources,
    toggleResourceCompletion,
    mascotState,
    isSkyMode
  } = useWellness();

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);


  const skyColors = {
    pageText: '#3A2415',
    secondaryText: '#5C4635',
    mutedText: '#7A5A3A',

    title: '#4A2511',
    subtitle: '#7A5A3A',

    searchBackground: '#FFFFFF',
    searchBorder: '#D6CBAE',
    searchText: '#3A2415',
    searchIcon: '#6B5140',
    placeholder: '#8A765E',

    inactiveTabBackground: '#FAFBF0',
    inactiveTabBorder: '#D6CBAE',
    inactiveTabText: '#3A2415',
    inactiveTabHover: '#FFFFFF',

    activeTabBackground: '#E88C9E',
    activeTabBorder: '#E88C9E',
    activeTabText: '#FFFFFF',

    waterStart: '#CFE2F3',
    waterEnd: '#A4D3DE',

    cardStart: '#F5E8C7',
    cardEnd: '#EAD5A0',

    cardText: '#4A2511',
    cardSecondaryText: '#7A5A3A',
    cardMutedText: '#A98F6B',

    iconBackground: 'rgba(255,255,255,0.60)',

    incompleteCheckBackground: 'rgba(255,255,255,0.70)',
    incompleteCheckBorder: '#D6CBAE',
    incompleteCheckText: '#7A6A58',

    completedCheckBackground: '#D9E7D0',
    completedCheckBorder: '#8FAE7B',
    completedCheckText: '#4E6D45',

    modalOverlay: 'rgba(74,37,17,0.60)',
    modalBackground: '#FAFBF0',
    modalBorder: '#E8E2D1',

    contentBackground: '#F5E8C7',
    contentBorder: '#EAD5A0',
    contentText: '#3A2415',

    stepBackground: '#FFFFFF',
    stepBorder: '#EAD5A0',
    stepText: '#3A2415',

    numberBackground: '#CFE2F3',
    numberText: '#3A2415',

    primaryButton: '#E88C9E',
    primaryButtonText: '#FFFFFF',

    ctaStart: '#CFE2F3',
    ctaEnd: '#A4D3DE',
    ctaBorder: '#7AABB8',
    ctaTitle: '#1F3A42',
    ctaText: '#2F4F58'
  };

  const nightColors = {
    pageText: '#F8EFD7',
    secondaryText: '#C5B8A8',
    mutedText: '#D8C7B0',

    title: '#F5E8C7',
    subtitle: '#D6CBAE',

    searchBackground: '#17212B',
    searchBorder: '#52616B',
    searchText: '#F8EFD7',
    searchIcon: '#B8AC9E',
    placeholder: '#9BA8AD',

    inactiveTabBackground: '#24313B',
    inactiveTabBorder: '#52616B',
    inactiveTabText: '#F8EFD7',
    inactiveTabHover: '#30404A',

    activeTabBackground: '#D47A8C',
    activeTabBorder: '#D47A8C',
    activeTabText: '#FFFFFF',

    waterStart: '#173B46',
    waterEnd: '#102A33',

    cardStart: '#3B4650',
    cardEnd: '#29343D',

    cardText: '#F8EFD7',
    cardSecondaryText: '#C5B8A8',
    cardMutedText: '#B8AC9E',

    iconBackground: 'rgba(23,33,43,0.75)',

    incompleteCheckBackground: 'rgba(48,64,74,0.85)',
    incompleteCheckBorder: '#52616B',
    incompleteCheckText: '#C5D0D4',

    completedCheckBackground: '#294238',
    completedCheckBorder: '#6F9D7E',
    completedCheckText: '#B7D9B0',

    modalOverlay: 'rgba(0,0,0,0.72)',
    modalBackground: '#17212B',
    modalBorder: '#52616B',

    contentBackground: '#24313B',
    contentBorder: '#52616B',
    contentText: '#F1E8D7',

    stepBackground: '#202B34',
    stepBorder: '#52616B',
    stepText: '#F1E8D7',

    numberBackground: '#38515B',
    numberText: '#F8EFD7',

    primaryButton: '#D47A8C',
    primaryButtonText: '#FFFFFF',

    ctaStart: '#173B46',
    ctaEnd: '#29434C',
    ctaBorder: '#5D8791',
    ctaTitle: '#F4F1E8',
    ctaText: '#D4DFE2'
  };

  const colors = isSkyMode
    ? skyColors
    : nightColors;

  const categories = [
    'All',
    'Anxiety & Panic Relief',
    'Cognitive Reframing',
    'Sleep & Relaxation',
    'Mindfulness & Self-Care'
  ];

  const filteredResources = STARTER_RESOURCES.filter(res => {

    const matchesCat =
      activeCategory === 'All' ||
      res.category === activeCategory;

    const matchesQuery =
      res.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      res.summary
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesCat && matchesQuery;
  });

  const getResourceIcon = (iconName) => {

    switch (iconName) {

      case 'Brain':
        return (
          <Brain
            className="w-5 h-5"
            style={{
              color: isSkyMode
                ? '#638C55'
                : '#A5C496'
            }}
          />
        );

      case 'Moon':
        return (
          <Moon
            className="w-5 h-5"
            style={{
              color: isSkyMode
                ? '#527F8A'
                : '#A4D3DE'
            }}
          />
        );

      case 'Heart':
        return (
          <Heart
            className="w-5 h-5"
            style={{
              color: isSkyMode
                ? '#C85F73'
                : '#F5B2B8'
            }}
          />
        );

      case 'Compass':
      default:
        return (
          <Compass
            className="w-5 h-5"
            style={{
              color: isSkyMode
                ? '#4F91A5'
                : '#A4D3DE'
            }}
          />
        );
    }
  };

  return (
    <div
      className="max-w-4xl mx-auto space-y-8 pb-10"
      style={{
        color: colors.pageText
      }}
    >

      <div className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <img src={frascoSvg} alt="Marine Jar" className="w-28 h-28 object-contain drop-shadow-lg" />
        </div>
        <h2
          className="font-display text-3xl font-bold flex items-center justify-center gap-2"
          style={{
            color: colors.title
          }}
        >

          <BookOpen
            className="w-7 h-7"
            style={{
              color: isSkyMode
                ? '#5E9FB2'
                : '#A4D3DE'
            }}
          />
          Smart Mental Health Library

        </h2>

        <p
          className="text-xs sm:text-sm max-w-xl mx-auto font-semibold"
          style={{
            color: colors.subtitle
          }}
        >
          Evidence-based guides, grounding practices, and CBT tools
          available whenever you need guidance.
        </p>

      </div>


      <CountryCrisisLines />

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">

        <div className="flex overflow-x-auto gap-2 w-full sm:w-auto py-1 no-scrollbar">

          {categories.map(cat => {

            const isActive =
              activeCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className="
                  px-3.5
                  py-1.5
                  rounded-full
                  text-xs
                  font-bold
                  whitespace-nowrap
                  transition-all
                  border
                "
                style={{
                  background: isActive
                    ? colors.activeTabBackground
                    : colors.inactiveTabBackground,

                  borderColor: isActive
                    ? colors.activeTabBorder
                    : colors.inactiveTabBorder,

                  color: isActive
                    ? colors.activeTabText
                    : colors.inactiveTabText,

                  boxShadow:
                    isActive && isSkyMode
                      ? '0 4px 10px rgba(232,140,158,0.35)'
                      : 'none'
                }}
              >
                {cat}
              </button>
            );
          })}

        </div>

        <div className="relative w-full sm:w-64">

          <Search
            className="w-4 h-4 absolute left-3 top-3"
            style={{
              color: colors.searchIcon
            }}
          />

          <input
            type="text"
            value={searchQuery}
            onChange={e =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search guides..."
            className="
              w-full
              pl-9
              pr-4
              py-2
              rounded-xl
              border
              text-sm
              font-medium
              outline-none
              transition-colors
              focus:ring-2
            "
            style={{
              background: colors.searchBackground,
              borderColor: colors.searchBorder,
              color: colors.searchText,

              '--tw-ring-color': isSkyMode
                ? '#A4D3DE'
                : '#5E8994'
            }}
          />

        </div>

      </div>

      <div
        className="
          relative
          rounded-[3rem]
          p-6
          sm:p-10
          overflow-hidden
        "
        style={{
          background:
            `linear-gradient(135deg, ${colors.waterStart}, ${colors.waterEnd})`
        }}
      >

        {/* Wave lines */}

        <svg
          className="absolute inset-x-0 top-0 w-full h-16 sm:h-24 opacity-40"
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
        >
          <path
            d="M0 10 Q 25 2 50 10 T 100 10"
            stroke="#FFFFFF"
            strokeWidth="0.8"
            fill="none"
            opacity="0.6"
          />

          <path
            d="M0 15 Q 25 8 50 15 T 100 15"
            stroke="#FFFFFF"
            strokeWidth="0.6"
            fill="none"
            opacity="0.4"
          />
        </svg>


        {/* Decorations */}

        <span
          className="absolute top-5 left-6 w-9 h-9 sm:w-11 sm:h-11"
          style={{
            opacity: isSkyMode ? 0.9 : 0.75
          }}
        >
          <FishIcon />
        </span>


        <span
          className="absolute top-8 right-8 w-8 h-8 sm:w-10 sm:h-10"
          style={{
            opacity: isSkyMode ? 0.8 : 0.7
          }}
        >
          <SeaweedIcon />
        </span>


        <span
          className="absolute bottom-8 left-10 w-8 h-8 sm:w-9 sm:h-9"
          style={{
            opacity: isSkyMode ? 0.8 : 0.7
          }}
        >
          <SeaGlassIcon />
        </span>


        <span
          className="absolute bottom-6 right-1/4 w-8 h-8 sm:w-9 sm:h-9"
          style={{
            opacity: isSkyMode ? 0.8 : 0.7
          }}
        >
          <SandDollarIcon />
        </span>


        <span
          className="absolute top-1/2 left-1/3 w-7 h-7 sm:w-8 sm:h-8"
          style={{
            opacity: isSkyMode ? 0.7 : 0.6
          }}
        >
          <BalanceRocksIcon />
        </span>


        <span
          className="absolute bottom-10 right-8 w-8 h-8 sm:w-9 sm:h-9"
          style={{
            opacity: isSkyMode ? 0.8 : 0.7
          }}
        >
          <SeashellIcon />
        </span>


        {/* RESOURCE CARDS */}

        <div className="relative z-10 flex flex-wrap justify-center gap-6 sm:gap-10 pt-4">

          {filteredResources.map(res => {

            const isCompleted =
              completedResources.includes(res.id);

            return (

              <button
                key={res.id}
                type="button"
                onClick={() =>
                  setSelectedResource(res)
                }
                className="
                  relative
                  w-56
                  h-56
                  sm:w-72
                  sm:h-72
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                  p-6
                  shadow-xl
                  transition-all
                  hover:-translate-y-1
                  hover:scale-[1.02]
                "
                style={{
                  borderRadius:
                    '48% 52% 51% 49% / 52% 48% 50% 50%',

                  background:
                    `linear-gradient(135deg, ${colors.cardStart}, ${colors.cardEnd})`,

                  color: colors.cardText
                }}
              >

                {/* COMPLETION CHECK */}

                <span
                  role="button"
                  tabIndex={0}
                  onClick={e => {
                    e.stopPropagation();
                    toggleResourceCompletion(res.id);
                  }}
                  onKeyDown={e => {

                    if (
                      e.key === 'Enter' ||
                      e.key === ' '
                    ) {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleResourceCompletion(res.id);
                    }

                  }}
                  className="
                    absolute
                    top-4
                    right-4
                    z-20
                    p-1.5
                    rounded-full
                    border
                    transition-all
                    cursor-pointer
                  "
                  style={{
                    background: isCompleted
                      ? colors.completedCheckBackground
                      : colors.incompleteCheckBackground,

                    borderColor: isCompleted
                      ? colors.completedCheckBorder
                      : colors.incompleteCheckBorder,

                    color: isCompleted
                      ? colors.completedCheckText
                      : colors.incompleteCheckText
                  }}
                  title={
                    isCompleted
                      ? 'Completed'
                      : 'Mark as Complete'
                  }
                  aria-label={
                    isCompleted
                      ? 'Mark as incomplete'
                      : 'Mark as complete'
                  }
                >

                  <CheckCircle className="w-4 h-4" />

                </span>


                {/* RESOURCE ICON */}

                <div
                  className="p-2 rounded-xl mb-2"
                  style={{
                    background:
                      colors.iconBackground
                  }}
                >
                  {getResourceIcon(res.icon)}
                </div>


                {/* CATEGORY */}

                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                  "
                  style={{
                    color:
                      colors.cardSecondaryText
                  }}
                >
                  {res.category}
                </span>


                {/* TITLE */}

                <h3
                  className="
                    font-display
                    font-bold
                    text-base
                    sm:text-lg
                    leading-snug
                    mt-1
                    px-2
                  "
                  style={{
                    color:
                      colors.cardText
                  }}
                >
                  {res.title}
                </h3>


                {/* SUMMARY */}

                <p
                  className="
                    text-[11px]
                    leading-snug
                    mt-1.5
                    px-3
                    line-clamp-3
                  "
                  style={{
                    color:
                      colors.cardSecondaryText
                  }}
                >
                  {res.summary}
                </p>


                {/* READ TIME */}

                <span
                  className="
                    text-[10px]
                    font-semibold
                    mt-2
                    flex
                    items-center
                    gap-1
                  "
                  style={{
                    color:
                      colors.cardMutedText
                  }}
                >

                  <Clock className="w-3 h-3" />

                  {res.readTime}

                </span>


                {/* GUIDE LINK */}

                <span
                  className="
                    text-[11px]
                    font-bold
                    mt-1.5
                    underline
                    underline-offset-2
                  "
                  style={{
                    color:
                      colors.cardSecondaryText
                  }}
                >
                  Read & Practice Guide
                </span>

              </button>

            );
          })}

        </div>

      </div>

      {selectedResource && (

        <div
          className="
            fixed
            inset-0
            z-50
            backdrop-blur-md
            flex
            items-start
            justify-center
            px-4
            pb-4
            pt-[56px]
sm:pt-[72px]
          "
          style={{
            background:
              colors.modalOverlay
          }}
        >

          <div
            className="
              border
              rounded-3xl
              p-5
              sm:p-6
              max-w-lg
              w-full
              space-y-4
              shadow-2xl
              relative
              max-h-[calc(100vh-7rem)]
              overflow-y-auto
            "
            style={{
              background:
                colors.modalBackground,

              borderColor:
                colors.modalBorder,

              color:
                colors.pageText
            }}
          >

            {/* CLOSE */}

            <button
              type="button"
              aria-label="Close guide"
              onClick={() =>
                setSelectedResource(null)
              }
              className="
                absolute
                top-4
                right-4
                p-2
                rounded-full
                transition-colors
              "
              style={{
                color:
                  colors.mutedText,

                background:
                  'transparent'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background =
                  isSkyMode
                    ? '#F5E8C7'
                    : '#24313B';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background =
                  'transparent';
              }}
            >
              <X className="w-5 h-5" />
            </button>


            {/* MODAL HEADER */}

            <div className="space-y-2 pr-10">

              <span
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                "
                style={{
                  color: isSkyMode
                    ? '#7FB8C9'
                    : '#A4D3DE'
                }}
              >
                {selectedResource.category}
                {' • '}
                {selectedResource.readTime}
              </span>


              <h3
                className="
                  font-display
                  text-2xl
                  font-bold
                "
                style={{
                  color:
                    colors.pageText
                }}
              >
                {selectedResource.title}
              </h3>

            </div>


            {/* EXPLANATION */}

            <div
              className="
                p-4
                rounded-2xl
                border
                text-sm
                font-medium
                leading-relaxed
              "
              style={{
                background:
                  colors.contentBackground,

                borderColor:
                  colors.contentBorder,

                color:
                  colors.contentText
              }}
            >
              {selectedResource.content}
            </div>


            {/* GUIDED STEPS */}

            <div className="space-y-3">

              <h4
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  flex
                  items-center
                  gap-1.5
                "
                style={{
                  color:
                    colors.mutedText
                }}
              >

                <Sparkles
                  className="w-4 h-4"
                  style={{
                    color: isSkyMode
                      ? '#D6BA7A'
                      : '#EAD5A0'
                  }}
                />

                Guided Steps & Practice:

              </h4>


              <ol
                className="
                  space-y-2
                  text-xs
                  sm:text-sm
                  font-medium
                "
                style={{
                  color:
                    colors.stepText
                }}
              >

                {selectedResource.steps.map(
                  (step, idx) => (

                    <li
                      key={idx}
                      className="
                        flex
                        items-start
                        gap-3
                        p-3
                        rounded-xl
                        border
                      "
                      style={{
                        background:
                          colors.stepBackground,

                        borderColor:
                          colors.stepBorder,

                        color:
                          colors.stepText
                      }}
                    >

                      <span
                        className="
                          w-5
                          h-5
                          rounded-full
                          font-bold
                          text-xs
                          flex
                          items-center
                          justify-center
                          shrink-0
                        "
                        style={{
                          background:
                            colors.numberBackground,

                          color:
                            colors.numberText
                        }}
                      >
                        {idx + 1}
                      </span>

                      <span className="leading-relaxed">
                        {step}
                      </span>

                    </li>

                  )
                )}

              </ol>

            </div>


            {/* COMPLETE BUTTON */}

            <div className="pt-4 flex justify-end">

              <button
                type="button"
                onClick={() => {

                  toggleResourceCompletion(
                    selectedResource.id
                  );

                  setSelectedResource(null);

                }}
                className="
                  px-6
                  py-3
                  rounded-2xl
                  font-bold
                  text-xs
                  transition-all
                  flex
                  items-center
                  gap-2
                  shadow-md
                  hover:-translate-y-0.5
                "
                style={{
                  background:
                    colors.primaryButton,

                  color:
                    colors.primaryButtonText
                }}
              >

                <CheckCircle className="w-4 h-4" />

                {completedResources.includes(
                  selectedResource.id
                )
                  ? 'Completed!'
                  : 'Mark Guide Complete'}

              </button>

            </div>

            {selectedResource.id === 'res-54321' && (

              <div
                className="
                  rounded-2xl
                  border
                  p-5
                  sm:p-6
                  flex
                  flex-col
                  sm:flex-row
                  items-center
                  justify-between
                  gap-4
                  text-center
                  sm:text-left
                "
                style={{
                  background:
                    `linear-gradient(135deg, ${colors.ctaStart}, ${colors.ctaEnd})`,

                  borderColor:
                    colors.ctaBorder
                }}
              >

                <div className="space-y-1">

                  <p
                    className="
                      font-display
                      font-bold
                      text-base
                      sm:text-lg
                    "
                    style={{
                      color:
                        colors.ctaTitle
                    }}
                  >
                    Want to try it out? 🌊
                  </p>

                  <p
                    className="
                      text-xs
                      sm:text-sm
                      font-medium
                    "
                    style={{
                      color:
                        colors.ctaText
                    }}
                  >
                    Walk through this grounding exercise
                    step by step with Sisu.
                  </p>

                </div>


                <button
                  type="button"
                  onClick={() => {

                    setActiveTab(
                      'grounding-54321'
                    );

                    setSelectedResource(null);

                  }}
                  className="
                    w-full
                    sm:w-auto
                    shrink-0
                    px-6
                    py-3
                    rounded-2xl
                    font-bold
                    text-xs
                    shadow-md
                    transition-all
                    hover:-translate-y-0.5
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                  style={{
                    background:
                      colors.primaryButton,

                    color:
                      colors.primaryButtonText
                  }}
                >

                  Start Practice

                  <ArrowRight className="w-4 h-4" />

                </button>

              </div>

            )}

          </div>

        </div>

      )}

    </div>
  );
}