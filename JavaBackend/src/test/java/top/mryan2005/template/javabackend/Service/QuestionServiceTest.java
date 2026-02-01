package top.mryan2005.template.javabackend.Service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import top.mryan2005.template.javabackend.Exception.ResourceNotFoundException;
import top.mryan2005.template.javabackend.Pojo.Collection;
import top.mryan2005.template.javabackend.Pojo.Question;
import top.mryan2005.template.javabackend.Pojo.User;
import top.mryan2005.template.javabackend.Pojo.UserAnswer;
import top.mryan2005.template.javabackend.Repository.CollectionRepository;
import top.mryan2005.template.javabackend.Repository.QuestionRepository;
import top.mryan2005.template.javabackend.Repository.UserAnswerRepository;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuestionServiceTest {

    private static final Long UNAUTHORIZED_USER_ID = 999L;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private UserAnswerRepository userAnswerRepository;

    @Mock
    private CollectionRepository collectionRepository;

    @Mock
    private UserService userService;

    @Mock
    private KnowledgePointService knowledgePointService;

    @InjectMocks
    private QuestionService questionService;

    private Question testQuestion;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        testQuestion = new Question();
        testQuestion.setId(1L);
        testQuestion.setTitle("Test Question");
        testQuestion.setCreator(testUser);
    }

    @Test
    void deleteQuestion_WithUserAnswersAndCollections_ShouldDeleteAllDependencies() {
        // Arrange
        Long questionId = 1L;
        Long userId = 1L;

        UserAnswer userAnswer1 = new UserAnswer();
        userAnswer1.setId(1L);
        UserAnswer userAnswer2 = new UserAnswer();
        userAnswer2.setId(2L);
        List<UserAnswer> userAnswers = Arrays.asList(userAnswer1, userAnswer2);

        Collection collection1 = new Collection();
        collection1.setId(1L);
        Collection collection2 = new Collection();
        collection2.setId(2L);
        List<Collection> collections = Arrays.asList(collection1, collection2);

        when(questionRepository.findById(questionId)).thenReturn(Optional.of(testQuestion));
        when(userAnswerRepository.findByQuestionId(questionId)).thenReturn(userAnswers);
        when(collectionRepository.findByQuestionId(questionId)).thenReturn(collections);

        // Act
        questionService.deleteQuestion(questionId, userId);

        // Assert
        verify(questionRepository).findById(questionId);
        verify(userAnswerRepository).findByQuestionId(questionId);
        verify(userAnswerRepository).deleteAll(userAnswers);
        verify(collectionRepository).findByQuestionId(questionId);
        verify(collectionRepository).deleteAll(collections);
        verify(questionRepository).delete(testQuestion);
    }

    @Test
    void deleteQuestion_WithNoDependencies_ShouldDeleteQuestion() {
        // Arrange
        Long questionId = 1L;
        Long userId = 1L;

        when(questionRepository.findById(questionId)).thenReturn(Optional.of(testQuestion));
        when(userAnswerRepository.findByQuestionId(questionId)).thenReturn(Collections.emptyList());
        when(collectionRepository.findByQuestionId(questionId)).thenReturn(Collections.emptyList());

        // Act
        questionService.deleteQuestion(questionId, userId);

        // Assert
        verify(questionRepository).findById(questionId);
        verify(userAnswerRepository).findByQuestionId(questionId);
        verify(userAnswerRepository).deleteAll(Collections.emptyList());
        verify(collectionRepository).findByQuestionId(questionId);
        verify(collectionRepository).deleteAll(Collections.emptyList());
        verify(questionRepository).delete(testQuestion);
    }

    @Test
    void deleteQuestion_QuestionNotFound_ShouldThrowException() {
        // Arrange
        Long questionId = 999L;
        Long userId = 1L;

        when(questionRepository.findById(questionId)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            questionService.deleteQuestion(questionId, userId);
        });

        verify(questionRepository).findById(questionId);
        verify(userAnswerRepository, never()).findByQuestionId(any());
        verify(collectionRepository, never()).findByQuestionId(any());
        verify(questionRepository, never()).delete(any());
    }

    @Test
    void deleteQuestion_UnauthorizedUser_ShouldThrowException() {
        // Arrange
        Long questionId = 1L;

        when(questionRepository.findById(questionId)).thenReturn(Optional.of(testQuestion));

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            questionService.deleteQuestion(questionId, UNAUTHORIZED_USER_ID);
        });

        verify(questionRepository).findById(questionId);
        verify(userAnswerRepository, never()).findByQuestionId(any());
        verify(collectionRepository, never()).findByQuestionId(any());
        verify(questionRepository, never()).delete(any());
    }
}
