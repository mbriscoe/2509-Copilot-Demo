import random

# Color helpers (ANSI escape codes)


class Colors:
    RESET = "\033[0m"
    BRIGHT = "\033[1m"
    RED = "\033[31m"
    GREEN = "\033[32m"
    YELLOW = "\033[33m"
    BLUE = "\033[34m"
    MAGENTA = "\033[35m"
    CYAN = "\033[36m"
    WHITE = "\033[37m"
    BG_WHITE = "\033[47m"
    BLACK = "\033[30m"


def color_text(text, color):
    return f"{color}{text}{Colors.RESET}"


# Card and Deck setup
suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
ranks = [
    {'name': '2', 'value': 2}, {'name': '3',
                                'value': 3}, {'name': '4', 'value': 4},
    {'name': '5', 'value': 5}, {'name': '6',
                                'value': 6}, {'name': '7', 'value': 7},
    {'name': '8', 'value': 8}, {'name': '9', 'value': 9}, {
        'name': '10', 'value': 10},
    {'name': 'J', 'value': 11}, {'name': 'Q', 'value': 12}, {
        'name': 'K', 'value': 13}, {'name': 'A', 'value': 14}
]


def create_deck():
    deck = []
    for suit in suits:
        for rank in ranks:
            deck.append(
                {'suit': suit, 'rank': rank['name'], 'value': rank['value']})
    return deck


def shuffle(deck):
    random.shuffle(deck)
    return deck


def get_card_color(suit):
    if suit in ['Hearts', 'Diamonds']:
        return Colors.RED
    return Colors.BLACK


def get_suit_symbol(suit):
    return {'Hearts': '♥', 'Diamonds': '♦', 'Clubs': '♣', 'Spades': '♠'}.get(suit, '?')


def render_card(card):
    suit_symbol = get_suit_symbol(card['suit'])
    rank_left = card['rank'].ljust(2)
    rank_right = card['rank'].rjust(2)
    color = get_card_color(card['suit'])
    bg = Colors.BG_WHITE
    # Use '│' for vertical borders
    return [
        f"{bg}{color}┌───────┐{Colors.RESET}",
        f"{bg}{color}│{rank_left}     │{Colors.RESET}",
        f"{bg}{color}│       │{Colors.RESET}",
        f"{bg}{color}│   {suit_symbol}   │{Colors.RESET}",
        f"{bg}{color}│       │{Colors.RESET}",
        f"{bg}{color}│     {rank_right}│{Colors.RESET}",
        f"{bg}{color}└───────┘{Colors.RESET}"
    ]


def render_cards_side_by_side(card1, card2):
    lines1 = render_card(card1)
    lines2 = render_card(card2)
    return '\n'.join([l1 + '  ' + l2 for l1, l2 in zip(lines1, lines2)])


def wait_for_enter():
    input(color_text("Press Enter to continue...", Colors.MAGENTA))


def clear_console():
    print("\033c", end="")


def play_game():
    clear_console()
    print(color_text('Welcome to the 2-Player Card Game!', Colors.CYAN))
    print(color_text(
        'Each player is dealt a card. The highest card wins the hand and gets both cards.', Colors.YELLOW))
    print(color_text('The process repeats until all 52 cards are dealt.', Colors.YELLOW))
    print(color_text(
        'The player with the highest score at the end wins the game.', Colors.YELLOW))
    print(color_text('Press Enter after each hand to continue.\n', Colors.MAGENTA))
    wait_for_enter()

    deck = create_deck()
    shuffle(deck)

    player1_score = 0
    player2_score = 0

    for i in range(0, len(deck), 2):
        clear_console()
        card1 = deck[i]
        card2 = deck[i + 1]

        print(color_text(f"Hand {i // 2 + 1}:", Colors.BRIGHT))
        print(render_cards_side_by_side(card1, card2))
        print(color_text(
            f"Player 1: {card1['rank']} of {card1['suit']}", Colors.BLUE))
        print(color_text(
            f"Player 2: {card2['rank']} of {card2['suit']}", Colors.GREEN))

        if card1['value'] > card2['value']:
            player1_score += 2
            print(color_text('Player 1 wins the hand.\n', Colors.BLUE))
        elif card2['value'] > card1['value']:
            player2_score += 2
            print(color_text('Player 2 wins the hand.\n', Colors.GREEN))
        else:
            player1_score += 1
            player2_score += 1
            print(color_text('Tie! Both players get 1 point.\n', Colors.YELLOW))

        wait_for_enter()

    clear_console()
    print(color_text('Game Over!', Colors.MAGENTA))
    print(color_text(f"Player 1 Score: {player1_score}", Colors.BLUE))
    print(color_text(f"Player 2 Score: {player2_score}", Colors.GREEN))

    if player1_score > player2_score:
        print(color_text('Player 1 wins the game!', Colors.BLUE))
    elif player2_score > player1_score:
        print(color_text('Player 2 wins the game!', Colors.GREEN))
    else:
        print(color_text('The game is a tie!', Colors.YELLOW))


if __name__ == "__main__":
    play_game()
