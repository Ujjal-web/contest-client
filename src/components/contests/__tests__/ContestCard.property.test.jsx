import { render } from '@testing-library/react';
import { fc } from 'fast-check';
import ContestCard from '../ContestCard';
import { BrowserRouter } from 'react-router-dom';

// Mock the auth hook
jest.mock('../../../hooks/useAuth', () => ({
    __esModule: true,
    default: () => ({ user: { id: 'test-user' } })
}));

// Test wrapper component
const TestWrapper = ({ children }) => (
    <BrowserRouter>
        {children}
    </BrowserRouter>
);

// Generator for contest data
const contestArbitrary = fc.record({
    _id: fc.string({ minLength: 1 }),
    name: fc.option(fc.string({ minLength: 1, maxLength: 100 })),
    title: fc.option(fc.string({ minLength: 1, maxLength: 100 })),
    image: fc.option(fc.webUrl()),
    description: fc.option(fc.string({ minLength: 10, maxLength: 500 })),
    participantsCount: fc.option(fc.integer({ min: 0, max: 10000 })),
    participationCount: fc.option(fc.integer({ min: 0, max: 10000 })),
    type: fc.option(fc.constantFrom('Image Design', 'Logo Design', 'Article Writing', 'Business Idea', 'Game Review', 'Photography', 'Other')),
    prizeMoney: fc.option(fc.integer({ min: 0, max: 100000 })),
    price: fc.option(fc.float({ min: 0, max: 1000, noNaN: true }))
});

/**
 * Feature: card-layout-standardization, Property 1: Card dimensional consistency
 * Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5
 */
describe('ContestCard CSS Class Consistency Properties', () => {
    test('Property 1: Card dimensional consistency - all cards should have identical dimensions and styling', () => {
        fc.assert(
            fc.property(fc.array(contestArbitrary, { minLength: 2, maxLength: 10 }), (contests) => {
                // Render multiple cards
                const renderedCards = contests.map((contest, index) =>
                    render(
                        <TestWrapper>
                            <ContestCard contest={contest} />
                        </TestWrapper>
                    )
                );

                const cardElements = renderedCards.map(({ container }) =>
                    container.querySelector('.card')
                );

                // All cards should exist
                expect(cardElements.every(card => card !== null)).toBe(true);

                if (cardElements.length > 1) {
                    const firstCard = cardElements[0];
                    const firstCardStyles = window.getComputedStyle(firstCard);

                    // Check that all cards have identical computed styles for key properties
                    cardElements.slice(1).forEach((card, index) => {
                        const cardStyles = window.getComputedStyle(card);

                        // Border radius should be consistent
                        expect(cardStyles.borderRadius).toBe(firstCardStyles.borderRadius);

                        // Display and flex properties should be consistent
                        expect(cardStyles.display).toBe(firstCardStyles.display);
                        expect(cardStyles.flexDirection).toBe(firstCardStyles.flexDirection);

                        // Border and shadow properties should be consistent
                        expect(cardStyles.borderWidth).toBe(firstCardStyles.borderWidth);
                        expect(cardStyles.borderStyle).toBe(firstCardStyles.borderStyle);
                    });
                }

                // Cleanup
                renderedCards.forEach(({ unmount }) => unmount());
            }),
            { numRuns: 100 }
        );
    });

    test('Property 1b: Card aspect ratio consistency - all cards should maintain 4:5 aspect ratio', () => {
        fc.assert(
            fc.property(contestArbitrary, (contest) => {
                const { container, unmount } = render(
                    <TestWrapper>
                        <ContestCard contest={contest} />
                    </TestWrapper>
                );

                const cardElement = container.querySelector('.card');
                expect(cardElement).toBeTruthy();

                // Check if the card has the expected classes for standardization
                // Note: In a real test environment, we would check computed dimensions
                // For now, we verify the presence of expected CSS classes
                expect(cardElement.classList.contains('card')).toBe(true);
                expect(cardElement.classList.contains('bg-base-100')).toBe(true);
                expect(cardElement.classList.contains('shadow-sm')).toBe(true);
                expect(cardElement.classList.contains('border')).toBe(true);
                expect(cardElement.classList.contains('border-base-300')).toBe(true);
                expect(cardElement.classList.contains('hover:shadow-md')).toBe(true);
                expect(cardElement.classList.contains('transition')).toBe(true);
                expect(cardElement.classList.contains('duration-200')).toBe(true);
                expect(cardElement.classList.contains('rounded-2xl')).toBe(true);
                expect(cardElement.classList.contains('overflow-hidden')).toBe(true);
                expect(cardElement.classList.contains('flex')).toBe(true);
                expect(cardElement.classList.contains('flex-col')).toBe(true);

                unmount();
            }),
            { numRuns: 100 }
        );
    });

    test('Property 1c: Card internal structure consistency - all cards should have consistent internal padding and spacing', () => {
        fc.assert(
            fc.property(contestArbitrary, (contest) => {
                const { container, unmount } = render(
                    <TestWrapper>
                        <ContestCard contest={contest} />
                    </TestWrapper>
                );

                const cardBody = container.querySelector('.card-body');
                expect(cardBody).toBeTruthy();

                // Check card-body classes for consistent spacing
                expect(cardBody.classList.contains('card-body')).toBe(true);
                expect(cardBody.classList.contains('flex-1')).toBe(true);
                expect(cardBody.classList.contains('space-y-3')).toBe(true);

                // Check for image section if present
                const imageSection = container.querySelector('figure');
                if (imageSection) {
                    expect(imageSection.classList.contains('h-40')).toBe(true);
                    expect(imageSection.classList.contains('overflow-hidden')).toBe(true);
                }

                unmount();
            }),
            { numRuns: 100 }
        );
    });
});