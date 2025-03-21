PYTHON = python3
PIP = $(PYTHON) -m pip 
TEST_DIR = tests/
TEST_DIR_TILES = tests/tiles/
TEST_DIR_GAME = tests/game/
A_TESTER_TILE = TestTile TestTileH TestTileHc TestTileHh TestTileHj TestTileHr TestTileR TestTileRc TestTileRr TestTileS TestTileSc TestTileSh TestTileSr TestTileSs
A_TESTER_GAME = test_rules test_board
VENV_DIR = venv


test-tiles: $(patsubst %,$(TEST_DIR_TILES)/%.py, $(A_TESTER_TILE))
	PYTHONPATH=src:src/tiles:$(TEST_DIR_TILES) $(PYTHON) -m unittest $(A_TESTER_TILE)

test-game: $(patsubst %,$(TEST_DIR_GAME)/%.py, $(A_TESTER_GAME))
	PYTHONPATH=src:src/tiles:$(TEST_DIR_GAME) $(PYTHON) -m unittest $(A_TESTER_GAME)

clean: 
	find . -name "*.pyc" -delete 
	find . -name "__pycache__" -delete 
	rm -rf .mypy_cache .pytest_cache 
	rm -rf $(VENV_DIR) __pycache__

help:
	@echo "     available commands :            "
	@echo "     make test -> execute tests      "
	@echo "     make clean -> clean folder      "


make-venv: 
	$(PYTHON) -m venv $(VENV_DIR)


venv: make-venv
	. $(VENV_DIR)/bin/activate; pip install -r requirements.txt


launch-venv: venv


run: venv
	$(VENV_DIR)/bin/python server.py


.PHONY: test-tiles test-game clean help make-venv launch-venv run