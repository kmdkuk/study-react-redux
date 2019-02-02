import * as React from 'react';
import * as enzyme from 'enzyme';
import Todo from './Todo';

import * as Adapter from 'enzyme-adapter-react-16';

enzyme.configure({ adapter: new Adapter() });

const sel = (id: string) => `[data-test="${id}"]`;

const dummyItem = ({ completed = true, text = 'Todo item1', handleDeleteSpy = jest.fn(), handleToggleSpy = jest.fn() } = {}) => {
  return enzyme.shallow(
    <Todo
      completed={completed}
      text={text}
      handleDelete={handleDeleteSpy}
      handleToggle={handleToggleSpy}
    />
  );
};

describe('Todo text', () => {
  test('completed=trueのとき，テキストと取り消し線が描画される．', () => {
    // Arrange
    // ダミーの関数準備
    const itemText = 'todo Item 1';

    // act
    // テスト対象のcomponent生成
    const todoItem = dummyItem({ completed: true, text: itemText });

    // assert
    // テキストが描画される．
    expect(todoItem.find(sel('item-label')).text()).toEqual(itemText);
    // 取り消し線が描画される．
    const style = todoItem.find(sel('item-label')).props().style;
    if (style !== undefined) {
      expect(style.textDecoration).toEqual('line-through');
    }
  });

  test('completed=falseのとき，テキストだけが描画される．', () => {
    // arrange
    const itemText = 'todo Item 1';
    // act
    const todoItem = dummyItem({ completed: false, text: itemText });

    // テキストが描画される．
    expect(todoItem.find(sel('item-label')).text()).toEqual(itemText);
    // テキストが描画されない．
    const style = todoItem.find(sel('item-label')).props().style;
    if (style !== undefined) {
      expect(style.textDecoration).toEqual('none');
    }
  });

  test('テキストをクリックするとhandleToggleが発火する．', () => {
    // arrange
    const handleToggleSpy = jest.fn();

    const todoItem = dummyItem({ handleToggleSpy })

    // act
    // テキストをクリック
    todoItem.find(sel('item-label')).simulate('click');

    // assert
    expect(handleToggleSpy).toHaveBeenCalled();
  });
});

describe('削除ボタン', () => {
  test('Todo1つにつき削除ボタンが1つ描画される．', () => {
    // arrange
    const todoItem = dummyItem();
    // assert
    expect(todoItem.find(sel('delete-button')).text()).toEqual('削除');
    expect(todoItem.find(sel('delete-button')).length).toBe(1);
  });

  test('削除ボタンをクリックするとhandleDeleteが発火する．', () => {
    const handleDeleteSpy = jest.fn();
    const todoItem = dummyItem({ handleDeleteSpy });

    // 削除ボタンを押す．
    todoItem.find(sel('delete-button')).simulate('click');

    // handleDeleteが発火する．
    expect(handleDeleteSpy).toHaveBeenCalled();
  })
})
